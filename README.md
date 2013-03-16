jquery-responsive-carousel
==========================

This is a simple jQuery plugin that creates a responsive carousel. 

Essentialy it is a content slider (the nature of the content is irrelevant) that cycles back to the first element when it reaches the end.
The added requirement was for the carousel to initialize itself only when there is not enough space for *all* the content items to be shown 
& destroy itself when enough space is available. Due to this responsive nature, it aims to be used inside elements that change their width 
proportionaly to the page width.

For the carousel to work, the items to be slided need to be placed inside an unordered list and **all items need to have the same width**.
The exact html structure is showed inside the demo (index.html).

The carousel is initialized via a call to:

`$(carousel_container_selector).carousel([options]);`

The available options are:

*	`animateDuration`	: the duration (in ms) of the slide animation (default: 300)
*	`autoSlide`			: boolean that enables/disables autosliding (default: true)
*	`autoSlideInterval`	: the interval (in ms) between two consecutive autoslides (needed only if autoslide is true, default:4000)
*	`pauseOnHover`		: whether the autosliding will pause when mouse hovers over the carousel (default: true)
*	`keySlide`			: whether sliding can be performed using the left/right keys (default: true)