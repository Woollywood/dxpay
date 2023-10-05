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

class AnimationHandler {
	constructor(layout, meta) {
		this._layout = layout;
		this._meta = meta;

		this.layoutObserver = new MutationObserver(this._layoutObserverCallback.bind(this));
		this.layoutObserver.observe(this._layout, {
			childList: true,
		});

		this._currentAnimationIndex = -1;
		this._animationObserverIndex = 0;

		this._animationCache = new Map();
		this._stack = [];
	}

	_layoutObserverCallback(event) {
		for (const { addedNodes } of event) {
			for (const node of addedNodes) {
				if (node.tagName === 'svg') node.dataset.animationId = this._animationObserverIndex++;
			}
		}
	}

	_loadAnimation(path) {
		return new Promise((resolve, reject) => {
			const animation = bodymovin.loadAnimation({
				container: this._layout,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path,
			});

			animation.addEventListener('DOMLoaded', () => {
				resolve(animation);
			});

			animation.addEventListener('complete', (e) => {
				if (this._stack.length) {
					this._animationPlay(this._stack.shift());
				}
			});

			animation.addEventListener('error', (error) => {
				reject(error);
			});
		});
	}

	_svgStylesReset(animationIndex) {
		const animationSvgList = this._layout.querySelectorAll('svg');
		animationSvgList?.forEach((animation) => animation.classList.remove('animation-playing'));
		const animationSvg = this._layout.querySelector(`[data-animation-id="${animationIndex}"]`);
		animationSvg.classList.add('animation-playing');
	}

	/**
	 * Воспроизведение анимации по индексу
	 */
	_animationPlay({ direction, animationIndex }) {
		// console.log(`animation playing... direction=${direction}; index=${animationIndex}`);

		let animationObject = null;
		if (!this._animationCache.has(this._meta[animationIndex].src)) {
			this._loadAnimation(this._meta[animationIndex].src, this._meta[animationIndex].offset).then((animation) => {
				// console.log(this._meta[animationIndex].src);

				animationObject = animation;
				this._svgStylesReset(animationIndex);
				this._animationCache.set(this._meta[animationIndex].src, animation);
				animationObject.setDirection(direction);
				animationObject.play();
			});
		} else {
			animationObject = this._animationCache.get(this._meta[animationIndex].src);
			this._svgStylesReset(animationIndex);
			animationObject.setDirection(direction);
			animationObject.play();
		}
	}

	/**
	 * Воспроизведение следующей анимации или добавление в очередь
	 */
	nextAnimation() {
		this._currentAnimationIndex++;

		if (!this._stack.length) {
			this._animationPlay({
				direction: 1,
				animationIndex: this._currentAnimationIndex,
			});
			this._stack.push({
				direction: 1,
				animationIndex: this._currentAnimationIndex,
			});
		} else {
			this._stack.push({
				direction: 1,
				animationIndex: this._currentAnimationIndex,
			});
		}
	}

	/**
	 * Обратное воспроизведение текущей анимации или добавление в очередь
	 */
	prevAnimation() {
		if (!this._stack.length) {
			this._animationPlay({
				direction: -1,
				animationIndex: this._currentAnimationIndex,
			});
			this._stack.push({
				direction: -1,
				animationIndex: this._currentAnimationIndex,
			});
		} else {
			this._stack.push({
				direction: -1,
				animationIndex: this._currentAnimationIndex,
			});
		}

		this._currentAnimationIndex--;
	}
}

class AnimationHandlerMobile {
	constructor(meta) {
		this._meta = meta;
		this._animationList = new Map();
	}

	_buildAnimation() {
		const animationSectionList = document.querySelectorAll('.section__animation-layout');
		animationSectionList.forEach(async (animationSection, index) => {
			await this._load(index, animationSection);
		});
	}

	async _load(animationIndex, container) {
		this._animationList.set(
			this._meta[animationIndex].src,
			await this._loadAnimation(this._meta[animationIndex].src, container)
		);
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
		this._buildAnimation();
	}

	play(animationIndex) {
		this._animationList.get(this._meta[animationIndex].src).play();
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

async function initLottie() {
	const sections = document.querySelectorAll('.section');
	sections.forEach((section, index) => {
		section.id = `section-${index}`;
		section.querySelector('.section__animation-layout').id = `animation-mobile-${index}`;
	});

	if (window.innerWidth > 767.98) {
		const animationHandler = new AnimationHandler(
			document.getElementById('animation-layout'),
			returnAnimationFiles()
		);
		animationHandler.nextAnimation();
		sections.forEach((section, index) => {
			ScrollTrigger.create({
				trigger: section,
				start: 'top top',
				onEnter: (triggerEvent) => {
					// console.log(`scroll into ${section.id}`);
					animationHandler.nextAnimation();
				},
				onLeaveBack: (triggerEvent) => {
					console.log('leave section');
					animationHandler.prevAnimation();
				},
			});
		});
	} else {
		const animationHandler = new AnimationHandlerMobile(returnAnimationFiles());
		await animationHandler.build();

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

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#animation-sections')) initLottie();
});
