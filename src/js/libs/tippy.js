// Подключение функционала "Чертоги Фрилансера"
import { isMobile, FLS } from '../custom/functions.js';
// Подключение списка активных модулей
import { flsModules } from '../custom/modules.js';

// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение стилей из src/scss/libs
import '../../scss/libs/tippy.scss';
// Подключение стилей из node_modules
//import 'tippy.js/dist/tippy.css';
// Запускаем и добавляем в объект модулей
flsModules.tippy = tippy('[data-tippy-content]', {});
