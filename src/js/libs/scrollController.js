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
		let animation = await this._loadAnimation(
			this._meta[animationIndex].src,
			container,
			this._meta[animationIndex].startOffset,
			this._meta[animationIndex].endOffset
		);
		animation.goToAndStop(this._meta[animationIndex].startOffset, true);
		this._animationList.set(this._meta[animationIndex].src, animation);
	}

	_loadAnimation(path, container, offset) {
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
		this._animationList
			.get(this._meta[animationIndex].src)
			.playSegments([this._meta[animationIndex].startOffset, this._meta[animationIndex].endOffset], true);
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
			console.log(e);
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
		if (lenis.targetScroll === 0) {
			document.documentElement.classList.add('lock');
			lenis.stop();
		}

		let animation = null;
		let animationFrames = null;

		ScrollTrigger.create({
			trigger: animationLayout,
			start: '1px top',
			end: 'bottom bottom',
			onEnter: (triggerEvent) => {
				console.log('enter');
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
			startOffset: 0,
			endOffset: 74,
		},
		{
			src: './files/lottie/data-02.json',
			startOffset: 74,
			endOffset: 166,
		},
		{
			src: './files/lottie/data-03.json',
			startOffset: 166,
			endOffset: 300,
		},
		{
			src: './files/lottie/data-04.json',
			startOffset: 300,
			endOffset: 400,
		},
		{
			src: './files/lottie/data-05.json',
			startOffset: 400,
			endOffset: 500,
		},
		{
			src: './files/lottie/data-06.json',
			startOffset: 500,
			endOffset: 600,
		},
		{
			src: './files/lottie/data-07.json',
			startOffset: 600,
			endOffset: 660,
		},
		{
			src: './files/lottie/data-08.json',
			startOffset: 660,
			endOffset: 860,
		},
		{
			src: './files/lottie/data-09.json',
			startOffset: 860,
			endOffset: 960,
		},
		{
			src: './files/lottie/data-10.json',
			startOffset: 960,
			endOffset: 1120,
		},
	];
}
