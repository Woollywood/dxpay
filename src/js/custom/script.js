// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from './functions.js';

// Подключение списка активных модулей
import { flsModules } from './modules.js';

let htmlElement = document.documentElement;
sectionPaddingCalculate(htmlElement);
getFooterHeight(htmlElement);
window.addEventListener('resize', (e) => {
	sectionPaddingCalculate(htmlElement);
	getFooterHeight(htmlElement);
});

function sectionPaddingCalculate(element) {
	let header = document.querySelector('.header');
	let headerBox = header.getBoundingClientRect();
	element.style.cssText += `--header-height: ${headerBox.height}px`;
}

function getFooterHeight(element) {
	const footer = document.querySelector('.footer');
	const footerBox = footer.getBoundingClientRect();
	element.style.cssText += `--footer-height: ${footerBox.height}px`;
}
