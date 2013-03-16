/**
 * @name		jQuery Responsive Carousel Plugin
 * @author		Christopher Varakliotis
 * @version		1.0
 * @url			-
 * @license		MIT License
 */

(function($, undefined){
	
	$.fn.carousel = function(options) {

		var $container = $(this);
		var $viewport = $container.children('#viewport');
		var $itemList = $viewport.children('#carousel-ul');
		
		var defaultOptions = {
			animateDuration: 300, // milliseconds
			autoSlide: true,
			autoSlideInterval: 4000, // milliseconds
			pauseOnHover: true,
			keySlide: true					
		};
		
		var _options = $.extend({}, defaultOptions, options||{});
		
		var properties = {
			$container: $container,
			$viewport: $viewport,
			$itemList: $itemList,
			$leftScroll: $container.children('#left-scroll'),
			$rightScroll: $container.children('#right-scroll'),
			listSize: $itemList.children('li').size(),
			itemWidth: $itemList.children('li').outerWidth(true)				
		};		
		
		return new Carousel(properties, _options);
	};
	
	// Carousel constructor
	var Carousel = function(properties, options) {
		
		var obj = this;
		
		obj.initialized = false; // flag that indicates initialization
		obj.animating = false; // flag that indicates animation
		obj.timer = {}; // auto slide timer
		
		obj.$container = properties.$container; // carousel container
		obj.$viewport = properties.$viewport; // visible part of the carousel
		obj.$itemList = properties.$itemList; // the item list
		obj.$leftScroll = properties.$leftScroll; // the left scroll button
		obj.$rightScroll = properties.$rightScroll; // the right scroll button
		obj.listSize = properties.listSize; // number of items in the list
		obj.itemWidth = properties.itemWidth; // width of each item (all items are assumed to have the same fixed size)
		
		obj.options = options;
		
		// Set item list width to fit all of it's items
		obj.$itemList.width( this.getTotalScrollButtonWidth() + this.getTotalItemWidth() );	
		
		// Set carousel width for the first time
		obj.setWidth();
		
		// Set carousel width each time browser window resizes
		$(window).resize(function() { 
			obj.setWidth();
		});		
	};
	
	Carousel.prototype = {
			
			getTotalItemWidth: function() {
				return this.listSize *  this.itemWidth;
			},
			
			getTotalScrollButtonWidth: function() {
				return this.$leftScroll.width() + this.$rightScroll.width();
			},
			
			setWidth: function() {	
				
				var max_avl_viewport_width = this.$container.width() - this.getTotalScrollButtonWidth() - 30; // 30px for some padding in-between the arrows
				var real_viewport_width = Math.min( max_avl_viewport_width,  this.getTotalItemWidth() );
				this.$viewport.width(real_viewport_width);
				// No need for a carousel, all images are visible
				if( real_viewport_width != max_avl_viewport_width ) {
					this.stop();
				}
				// Initialize the carousel
				else {
					this.init();		
				}
			},	
			
			slide: function(direction) {  
				
				if( !this.animating ) {
					var obj = this;
					obj.animating = true;	

					var $itemList = obj.$itemList;
					var itemWidth = obj.itemWidth;  		
					// slide the list to the specified direction
					if(direction == 'left'){    
						$itemList.animate({'left': '+=' + itemWidth}, obj.options.animateDuration, function() {
							$itemList.children('li').last().remove();
							$itemList.children('li').last().remove();
						    var oFirstLi = $itemList.children('li').first();
						    var oLastLi = $itemList.children('li').last();
						    $itemList.css({'left': '-=' + itemWidth});
						    oLastLi.clone().insertBefore( oFirstLi );
						    oFirstLi.clone().insertAfter( oLastLi );
						    obj.animating = false;
						});      
					}
					else{    
						$itemList.animate({'left': '-=' + itemWidth}, obj.options.animateDuration, function() {
							$itemList.children('li').first().remove();
							$itemList.children('li').first().remove();
						    var oFirstLi = $itemList.children('li').first();
						    var oLastLi = $itemList.children('li').last();
						    $itemList.css({'left': '+=' + itemWidth});
						    oLastLi.clone().insertBefore( oFirstLi );
						    oFirstLi.clone().insertAfter( oLastLi );
						    obj.animating = false;
						});   
					}  		
				} 
			},
			
			init: function(options) {
				
				if( !this.initialized ) {
					var obj = this;
					obj.initialized = true;
					
					// Bind handlers for clicks on arrows
					obj.$leftScroll.click(function() {
						obj.slide('left');
					});
					obj.$rightScroll.click(function() {
						obj.slide('right');
					});		
					
				    // Set timer if autoSlide is on  
					if( obj.options.autoSlide ) {  
						obj.timer = setInterval(function() {
							obj.slide("right"); 
						}, obj.options.autoSlideInterval);  
				    }  		  
					// Pause auto slide if pauseOnHover is on  
					if( obj.options.pauseOnHover ) {  
						obj.$container.hover(function() {  
					        clearInterval(obj.timer); 
					    }, function(){  
					    	obj.timer = setInterval(function() {
								obj.slide("right"); 
							}, obj.options.autoSlideInterval); 
				        });    
				    }  		  
				    // Bind handler for left/right keys if keySlide is on
				    if( obj.options.keySlide ) {    
					    $(document).bind('keypress', function(e) {  
					        if(e.keyCode==37){ // 37: left arrow 
					        	obj.slide('left');  
					        }
					        else if(e.keyCode==39){ // 39: right arrow    
					        	obj.slide('right');  
				            }  
				        });  	  
				    }
				    // Clone last item before the first and the first after the last
				    // NOTE: this happens only once during first initialization
			        var oFirstLi = obj.$itemList.children('li').first();
			        var oLastLi = obj.$itemList.children('li').last();
			        var li_width = oFirstLi.outerWidth(true);
			        obj.$itemList.width( obj.$itemList.width() + 2 * li_width );
			        oLastLi.clone().insertBefore( oFirstLi );
			        oFirstLi.clone().insertAfter( oLastLi );
			        obj.$itemList.css({'left': '-=' + li_width});   
			        // Show left/right arrows for scrolling
			        obj.$leftScroll.show();
					obj.$rightScroll.show();
				}
			},
			
			stop: function() {
				
				if( this.initialized ) {
					// Remove timer and unbind all event handlers
					clearInterval(this.timer);
					this.$leftScroll.unbind('click').hide();
					this.$rightScroll.unbind('click').hide();
					this.$container.unbind('hover');
					$(document).unbind('keypress');	
					// Remove clones from beginning and end of viewport
					this.$itemList.children('li').first().remove();
					this.$itemList.children('li').last().remove();
					// Resize and reposition item list accordingly
					this.$itemList.width(this.getTotalItemWidth()).css('left', '0px');
					// Mark carousel as not initialized
					this.initialized  = false;
				}
			}			
	};	

})(jQuery);  