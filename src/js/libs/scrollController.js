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
				console.log(this._stack);
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
				console.log('complete');

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
	_animationPlay(animationIndex) {
		let animationObject = null;
		if (!this._animationCache.has(this._meta[animationIndex].src)) {
			this._loadAnimation(this._meta[animationIndex].src).then((animation) => {
				animationObject = animation;
				this._svgStylesReset(animationIndex);
				this._animationCache.set(this._meta[animationIndex].src, animation);
				animationObject.setDirection(1);
				animationObject.play();
			});
		} else {
			animationObject = this._animationCache.get(this._meta[animationIndex].src);
			this._svgStylesReset(animationIndex);
			animationObject.setDirection(1);
			animationObject.play();
		}
	}

	/**
	 * Воспроизведение следующей анимации или добавление в очередь
	 */
	nextAnimation() {
		this._currentAnimationIndex++;

		if (!this._stack.length) {
			this._animationPlay(this._currentAnimationIndex);
			this._stack.push(this._currentAnimationIndex);
		} else {
			this._stack.push(this._currentAnimationIndex);
		}
	}

	
	prevAnimation() {
		const animationObject = this._animationCache.get(this._meta[this._currentAnimationIndex].src);
		animationObject.setDirection(-1);
		animationObject.play();
		this._svgStylesReset();

		this._currentAnimationIndex--;
	}
}

function returnAnimationFiles() {
	return [
		{
			src: './files/lottie/data-01.json',
		},
		{
			src: './files/lottie/data-02.json',
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
			src: '../../files/lottie/data-11.json',
		},
	];
}

async function initLottie() {
	if (window.innerWidth > 767.98) {
		const sections = document.querySelectorAll('.section');
		sections.forEach((section, index) => (section.id = `section-${index}`));

		let animationHandler = new AnimationHandler(
			document.getElementById('animation-layout'),
			returnAnimationFiles()
		);
		animationHandler.nextAnimation();
		sections.forEach((section, index) => {
			ScrollTrigger.create({
				trigger: section,
				start: 'top top',
				// markers: true,
				onEnter: (triggerEvent) => {
					console.log(`scroll into section ${section.id}`);
					animationHandler.nextAnimation();
				},
				onLeaveBack: (triggerEvent) => {
					console.log('leave section');
					animationHandler.prevAnimation();
				},
			});
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#animation-sections')) initLottie();
});
