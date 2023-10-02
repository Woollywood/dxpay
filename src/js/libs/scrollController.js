import { gsap, ScrollTrigger } from 'gsap/all.js';

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger);

if (document.querySelector('[data-scroll-container]')) {
	(async () => {
		await import('locomotive-scroll/dist/locomotive-scroll.css');
		let LocomotiveScrollModule = await import('locomotive-scroll');
		let LocomotiveScroll = LocomotiveScrollModule.default;
		const smoothScrolling = new LocomotiveScroll({
			el: document.querySelector('[data-scroll-container]'),
			smooth: true,
		});

		smoothScrolling.on('scroll', ScrollTrigger.update);

		ScrollTrigger.scrollerProxy('[data-scroll-container]', {
			scrollTop(value) {
				return arguments.length
					? smoothScrolling.scrollTo(value, 0, 0)
					: smoothScrolling.scroll.instance.scroll.y;
			},
			getBoundingClientRect() {
				return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
			},
			pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed',
		});

		// Init function for code here
		init();

		ScrollTrigger.addEventListener('refresh', () => smoothScrolling.update());
		ScrollTrigger.refresh();
	})();
} else {
	init();
}

function init() {
	// Custom code here
}
