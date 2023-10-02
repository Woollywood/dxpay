// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from './functions.js';

// Подключение списка активных модулей
import { flsModules } from './modules.js';

let sectionContainer = document.querySelector('.section');
if (window.innerWidth <= 767.98) sectionPaddingCalculate(sectionContainer);
window.addEventListener('resize', (e) => {
	if (window.innerWidth <= 767.98) {
		sectionPaddingCalculate(sectionContainer);
	} else {
		sectionContainer.style.paddingTop = '';
	}
});

function sectionPaddingCalculate(section) {
	let header = document.querySelector('.header');
	let headerBox = header.getBoundingClientRect();
	section.style.paddingTop = `${headerBox.height}px`;
}
