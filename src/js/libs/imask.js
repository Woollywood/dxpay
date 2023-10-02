import IMask from 'imask';

window.addEventListener('load', (windowEvent) => {
	let phoneInputs = document.querySelectorAll('.tel');

	if (phoneInputs.length) {
		let maskOptions = {
			mask: '+7 000 000 00 00',
			lazy: true,
		};

		phoneInputs.forEach((input) => {
			let mask = new IMask(input, maskOptions);
			let formInput = input.closest('form').addEventListener('reset', (e) => {
				mask.destroy();
			});
		});
	}
});
