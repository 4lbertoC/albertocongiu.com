window.AC.MailForm = (function ($) {
	'use strict';

	//
	// Reference to the DOM nodes.
	//
	var _mailCancel = $('#mailCancel');
	var _mailFormContainer = $('.mail-form-container');
	var _mailForm = $('#mailForm');
	var _mailFormFieldEmail = $('#mailFormEmail');
	var _mailFormFieldSubject = $('#mailFormSubject');
	var _mailFormFieldContent = $('#mailFormContent');

	var _hide = function () {
		_mailFormContainer.hide({
			effect: 'fade'
		});
	};

	var _init = function () {

		// Hide the form when click cancel.
		_mailCancel.click(_hide);

		//	Make the form request on submit.
		_mailForm.submit(function () {
			if ($(':invalid').length > 0) {
				alert('Some fields are missing.');
				return;
			}

			var mail = _mailFormFieldEmail.val();
			var subject = _mailFormFieldSubject.val();
			var content = _mailFormFieldContent.val();

			var datastr = 'mail=' + mail + '&subject=' + subject + '&messaggio=' + encodeURIComponent(content);

			$.ajax({
				type: 'POST',
				url: 'mail.php',
				data: datastr,
				cache: false,
				success: function (response) {
					if (response === 'ok') {
						alert('Message sent');
						_mailFormFieldEmail.val('');
						_mailFormFieldSubject.val('');
						_mailFormFieldContent.val('');
						_mailFormContainer.hide({
							effect: 'fade'
						});
					} else {
						alert('Error sending message.');
					}
				}
			});
		});
	};

	var _show = function () {
		_mailFormContainer.show({
			effect: 'fade'
		});
	};

	return {
		init: _init,

		show: _show,

		hide: _hide
	}
})(jQuery);