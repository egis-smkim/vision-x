function initPopup(parentId, openButtonClass) {
	$(`${parentId} .popup .popup-close`).on("click", function () {
		$(parentId).hide()
	})
	const initialContents = $(`${parentId} .popup`).html()
	$(openButtonClass).on("click", function () {
		$(parentId).show()
	})
}

$(document).ready(function () {
	function initSignUpPopup() {
		function resetForm() {
			const form = $('.sign-up-pop .contact-form')[0];
			if (form) {
				form.reset();
			} else {
				console.error('Sign up form not found!');
			}
			$('.sign-up-pop .send-hide, .contact-form').removeClass('hide');
			$('.sign-up-pop .contact-suc-msg').addClass('hide');
		}

		function initializePopup() {
			$('.sign-up-pop').removeClass('hide');
			$('.contact-suc-msg').addClass('hide');
		}
		initializePopup();

		$('.sign-up-btn').on('click', function () {
			$('#signUp_popup').show();
			resetForm();
		});

		$('.sign-up-submit').on('click', function (e) {
			e.preventDefault();
			$('.send-hide, .contact-form').addClass('hide');
			$('.contact-suc-msg').removeClass('hide');
		});

		$('.sign-up-close-submit, .popup-close').on('click', function () {
			$('#signUp_popup').hide();
			resetForm();
		});
	}

	function initSignInPopup() {
		function resetForm() {
			const form = $('.sign-in-pop .contact-form')[0];
			if (form) {
				form.reset();
			} else {
				console.error('Sign in form not found!');
			}
			$('.sign-in-pop').removeClass('hide');
			$('.reset-pop').addClass('hide');
		}

		function initializePopup() {
			$('.sign-in-pop').removeClass('hide');
			$('.reset-pop').addClass('hide');
		}

		initializePopup();

		$('.sign-in-btn').on('click', function () {
			$('#signIn_popup').show();
			resetForm();
		});

		//$('.sign-in-submit').on('click', function (e) {
		//	e.preventDefault();
		//	$('#signIn_popup').hide();
		//	resetForm();
		//});

		$('.sign-forgot').on('click', function (e) {
			e.preventDefault();
			$('.sign-in-pop').addClass('hide');
			$('.reset-pop').removeClass('hide');
		});

		$('.reset-submit, .popup-close').on('click', function () {
			$('#signIn_popup').hide();
			resetForm();
		});
	}

	function initContactPopup() {
		function resetForm() {
			const form = $('.contact-form')[0];
			if (form) {
				form.reset();
			} else {
				console.error('Contact form not found!');
			}
		}

		function initializePopup() {
			$('.send-hide, .contact-form').removeClass('hide');
			$('.contact-suc-msg').addClass('hide');
		}

		initializePopup();

		$('.contact-btn').on('click', function () {
			$('#contact_popup').show();
			initializePopup();
		});

		//$('.contact-submit').on('click', function (e) {
		//	e.preventDefault();
		//	if ($(this).hasClass('contact-close-msg')) {
		//		initializePopup();
		//	} else {
		//		$('.send-hide, .contact-form').addClass('hide');
		//		$('.contact-suc-msg').removeClass('hide');
		//		resetForm();
		//	}
		//});

		$('.popup-close').on('click', function () {
			$('#contact_popup').hide();
			initializePopup();
		});
	}



	window.initSignUpPopup = initSignUpPopup;
	window.initSignInPopup = initSignInPopup;
	window.initContactPopup = initContactPopup;
});
