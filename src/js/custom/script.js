// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from './functions.js';

// Подключение списка активных модулей
import { flsModules } from './modules.js';

let htmlElement = document.documentElement;
sectionPaddingCalculate(htmlElement);
window.addEventListener('resize', (e) => {
	sectionPaddingCalculate(htmlElement);
});

function sectionPaddingCalculate(element) {
	let header = document.querySelector('.header');
	let headerBox = header.getBoundingClientRect();
	element.style.cssText += `--header-height: ${headerBox.height}px`;
}
