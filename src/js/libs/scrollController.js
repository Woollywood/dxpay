import { gsap, ScrollTrigger } from 'gsap/all.js';

import { bodyLockStatus, bodyLockToggle, bodyLock, bodyUnlock } from '../custom/functions.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#animation-layout')) initLottie();
});

class AnimationHandlerMobile {
	constructor(meta) {
		this._meta = meta;
		this._animationList = new Map();
		this._animationCache = [];
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
		const animation = this._animationList.get(this._meta[animationIndex].src);
		if (!this._animationCache.includes(animation)) {
			animation.playSegments(
				[this._meta[animationIndex].startOffset, this._meta[animationIndex].endOffset],
				true
			);
			this._animationCache.push(animation);
		}
	}
}

const PATH = './files/lottie/data.json';
const START_OFFSET = 74;
const END_OFFSET = 1060;
let isStartAnimated;

function loadAnimation(path, container) {
	return new Promise((resolve, reject) => {
		const animation = bodymovin.loadAnimation({
			container,
			renderer: 'svg',
			loop: false,
			autoplay: false,
			path,
			progressiveLoad: true,
		});

		animation.addEventListener('complete', e => {
			if (!isStartAnimated) {
				bodyLockToggle();
			}
		})

		animation.addEventListener('DOMLoaded', () => {
			resolve(animation);
		});

		animation.addEventListener('error', (error) => {
			reject(error);
		});
	});
}

async function initLottie() {
	const sections = document.querySelectorAll('.section');
	sections.forEach((section, index) => {
		section.id = `section-${index}`;
		section.querySelector('.section__animation-layout').id = `animation-mobile-${index}`;
	});

	let animationLayout = document.querySelector('#animation-layout');
	let animationWrapper = document.querySelector('#animation-wrapper');

	if (window.innerWidth > 767.98) {
		if (window.scrollY === 0) {
			bodyLockToggle();
			isStartAnimated = false;
		} else {
			isStartAnimated = true;
		}

		let animation = null;
		let animationFrames = null;

		let animationObj = await loadAnimation(PATH, animationWrapper).then((animationObject) => {
			animation = animationObject;
			animationFrames = animationObject.totalFrames;
			return animationObject;
		});

		if (!isStartAnimated) {
			animationObj.playSegments([0, START_OFFSET], true);
		}

		ScrollTrigger.create({
			trigger: animationLayout,
			start: '1px top',
			end: 'bottom bottom',
			onUpdate: (triggerEvent) => {
				if (animation) {
					let progress =
						triggerEvent.progress * animationFrames + START_OFFSET - triggerEvent.progress * START_OFFSET;

					if (progress >= END_OFFSET) {
						progress = END_OFFSET;
					}

					animation.goToAndStop(progress, true);
				}
			},
		});
	} else {
		const animationHandler = new AnimationHandlerMobile(returnAnimationFiles());
		await animationHandler.build();
		animationHandler.play(0);
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
