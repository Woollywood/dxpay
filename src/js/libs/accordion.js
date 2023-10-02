import Accordion from 'accordion-js';
// import 'accordion-js/dist/accordion.min.css';

const DURATION = 600;
if (document.querySelector('.accordion-container')) {
	new Accordion('.accordion-container', {
		duration: DURATION,
		onlyChildNodes: false,
		showMultiple: true,
		elementClass: 'accordion',
		triggerClass: 'accordion__title',
		panelClass: 'accordion__content',
		activeClass: '_open',
		beforeOpen: (e) => {
			let header = e.querySelector('.accordion__header');
			let maxValue = 10;
			const operationTime = 60;
			const diff = DURATION / operationTime / maxValue;

			let padding = 0;
			setTimeout(function setSpace() {
				padding += diff;
				header.style.paddingBottom = `${padding}px`;

				if (padding != maxValue) {
					setTimeout(setSpace, operationTime);
				}
			}, operationTime);
		},
		beforeClose: (e) => {
			let header = e.querySelector('.accordion__header');
			let maxValue = 10;
			const operationTime = 60;
			const diff = DURATION / operationTime / maxValue;

			let padding = maxValue;
			setTimeout(function setSpace() {
				padding -= diff;
				header.style.paddingBottom = `${padding}px`;

				if (padding != 0) {
					setTimeout(setSpace, operationTime);
				}
			}, operationTime);
		},
	});
}
