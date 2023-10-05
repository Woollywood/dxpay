import { gsap, ScrollTrigger } from 'gsap/all.js';
import Lenis from '@studio-freight/lenis';
import '../../scss/libs/lenis.scss';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
	duration: 2,
	easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	direction: 'vertical',
	gestureOrientation: 'vertical',
	smooth: true,
	mouseMultiplier: 1,
	smoothTouch: false,
	touchMultiplier: 2,
	infinite: false,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#animation-layout')) initLottie();
});

class AnimationHandlerMobile {
	constructor(meta) {
		this._meta = meta;
		this._animationList = new Map();
	}

	async _buildAnimation() {
		const animationSectionList = document.querySelectorAll('.section__animation-layout');
		let index = 0;
		for await (const animationSection of animationSectionList) {
			await this._load(index++, animationSection);
		}
	}

	async _load(animationIndex, container) {
		let animation = await this._loadAnimation(this._meta[animationIndex].src, container);
		this._animationList.set(this._meta[animationIndex].src, animation);
	}

	_loadAnimation(path, container) {
		return new Promise((resolve, reject) => {
			const animation = bodymovin.loadAnimation({
				container,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path,
			});

			animation.addEventListener('DOMLoaded', () => {
				resolve(animation);
			});

			animation.addEventListener('error', (error) => {
				reject(error);
			});
		});
	}

	async build() {
		await this._buildAnimation();
	}

	play(animationIndex) {
		this._animationList.get(this._meta[animationIndex].src).play();
	}
}

function loadAnimation(path, container) {
	return new Promise((resolve, reject) => {
		const animation = bodymovin.loadAnimation({
			container,
			renderer: 'svg',
			loop: false,
			autoplay: false,
			path,
		});

		animation.addEventListener('enterFrame', (e) => {
			// console.log(e);
		});

		animation.addEventListener('DOMLoaded', () => {
			console.log('loaded');
			resolve(animation);
		});

		animation.addEventListener('error', (error) => {
			reject(error);
		});
	});
}

const PATH = './files/lottie/data.json';

async function initLottie() {
	const sections = document.querySelectorAll('.section');
	sections.forEach((section, index) => {
		section.id = `section-${index}`;
		section.querySelector('.section__animation-layout').id = `animation-mobile-${index}`;
	});

	let animationLayout = document.querySelector('#animation-layout');
	let animationWrapper = document.querySelector('#animation-wrapper');

	if (window.innerWidth > 767.98) {
		let animation = null;
		let animationFrames = null;

		ScrollTrigger.create({
			trigger: animationLayout,
			start: '-1px top',
			end: 'bottom bottom',
			onEnter: (triggerEvent) => {
				loadAnimation(PATH, animationWrapper).then((animationObject) => {
					animation = animationObject;
					animationFrames = animationObject.totalFrames;
				});
			},
			onUpdate: (triggerEvent) => {
				if (animation) animation.goToAndStop(triggerEvent.progress * animationFrames, true);
			},
		});
	} else {
		const animationHandler = new AnimationHandlerMobile(returnAnimationFiles());
		await animationHandler.build();
		console.log('build in listener');
		sections.forEach((section, index) => {
			ScrollTrigger.create({
				trigger: section,
				start: '-40% top',
				onEnter: (triggerEvent) => {
					console.log('enter');
					animationHandler.play(index);
				},
				onLeaveBack: (triggerEvent) => {},
			});
		});
	}
}

function returnAnimationFiles() {
	return [
		{
			src: './files/lottie/data-01.json',
		},
		{
			src: './files/lottie/data-02.json',
			offset: 76,
		},
		{
			src: './files/lottie/data-03.json',
		},
		{
			src: './files/lottie/data-04.json',
		},
		{
			src: './files/lottie/data-05.json',
		},
		{
			src: './files/lottie/data-06.json',
		},
		{
			src: './files/lottie/data-07.json',
		},
		{
			src: './files/lottie/data-08.json',
		},
		{
			src: './files/lottie/data-09.json',
		},
		{
			src: './files/lottie/data-10.json',
		},
		{
			src: './files/lottie/data-11.json',
		},
	];
}
