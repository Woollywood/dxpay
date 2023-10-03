import { gsap, ScrollTrigger } from 'gsap/all.js';
import Lenis from '@studio-freight/lenis';
import '../../scss/libs/lenis.scss';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const loadAnimation = (file) => {
	return new Promise((resolve, reject) => {
		const animation = bodymovin.loadAnimation({
			container: document.getElementById('animation-layout'),
			renderer: 'svg',
			loop: true,
			autoplay: true,
			path: file,
		});

		animation.addEventListener('DOMLoaded', () => {
			console.log('loaded');
			resolve(animation);
		});

		animation.addEventListener('error', (error) => {
			reject(error);
		});
	});
};

const PATH = '../../files/lottie/data.json';

async function initLottie() {
	if (window.innerWidth > 767.98) {
		const sections = document.querySelectorAll('.section');
		sections.forEach((section, index) => (section.id = `section-${index}`));

		loadAnimation(PATH);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#animation-sections')) initLottie();
});
