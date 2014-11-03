window.AC.Wheel = (function ($, Modernizr, jsfxlib, mailform, MusicTrigger, Pentagram) {
	'use strict';

	//
	// Constants
	//
	var _NOTES_CDEFGABC = [
        523.25,
        587.33,
        659.26,
        698.46,
        783.99,
        880.00,
        987.77,
        1046.50,
        1108.73
    ];

	// var _MUSIC_LOOP = '01234568';

	var _PATTERN_MAP = {
		'4': [
            '0246', // Cmaj7
            '2467',
            '6542' // 4ddamE
        ]
	};

	var _closeReader = function() {
		_disc.removeClass('should-move');
		_reader.addClass('moved-up');
		_cmaj.removeClass('moved-down');
	};

	var _openReader = function () {
		window._gaq && window._gaq.push(['_trackEvent', 'Play With Notes', 'Reader opened']);
		_reader.removeClass('moved-up');
		_disc.addClass('should-move');
		_cmaj.addClass('moved-down');
	};

	var _PATTERN_CALLBACK_MAP = {
		'0246': _openReader,
		'2467': _openReader,
		'6542': function () {
			_closeReader();
			if (_isDropped) {
				_disc.addClass('moving-disc');
				_disc.addClass('moved-up');
				setTimeout(function () {
					_gaq.push(['_trackEvent', 'Play With Notes', 'Reader closed with disc']);
					window.location = 'http://www.youtube.com/user/taranis86';
				}, 1500);
			} else {
				window._gaq && window._gaq.push(['_trackEvent', 'Play With Notes', 'Reader closed without disc']);
			}
		}
	};

	var _HIDDEN_WHEEL_CLASSNAME = 'behind';

	//
	// Reference to the DOM nodes.
	//
	var _disc = $('.disc');
	var _wheelDisc0 = $('#mainNav');
	var _wheelDisc1 = $('#secondNav');
	var _wheelDisc2 = $('#thirdNav');
	var _mailButton = $('#mailButton');
	var _reader = $('.reader');
	var _cmaj = $('.cmaj');
	// var _mark = $('.mark');
	var _discContainer = $('.disc-container');
	var _discContainerOpener = $('.disc-container-opener');
	var _linkWheelHandle = $('.link-wheel-handle');

	// Other variables.
	var _musicTrigger = new MusicTrigger(_PATTERN_MAP);
	var _isDropped = false;
	var _annoyingSound, _confirmSound;

	var _initArrowButtons = function () {
		// Initialize the wheel's arrow buttons.
		$('#next').click(function () {
			_wheelDisc0.addClass(_HIDDEN_WHEEL_CLASSNAME);
			_wheelDisc1.removeClass(_HIDDEN_WHEEL_CLASSNAME);
		});

		$('#prev').click(function () {
			_wheelDisc0.removeClass(_HIDDEN_WHEEL_CLASSNAME);
			_wheelDisc1.addClass(_HIDDEN_WHEEL_CLASSNAME);
		});

		$('#next2').click(function () {
			_wheelDisc1.addClass(_HIDDEN_WHEEL_CLASSNAME);
			_wheelDisc2.removeClass(_HIDDEN_WHEEL_CLASSNAME);
		});

		$('#prev2').click(function () {
			_wheelDisc1.removeClass(_HIDDEN_WHEEL_CLASSNAME);
			_wheelDisc2.addClass(_HIDDEN_WHEEL_CLASSNAME);
		});
	};

	var _initMailForm = function () {
		mailform.init();

		// Show the mail form when clicking the corresponding wheel button.
		_mailButton.click(mailform.show);
	};

	var _initSounds = function () {

		_musicTrigger.addListener(function (match) {
			var f = _PATTERN_CALLBACK_MAP[match];
			if (typeof f === 'function') {
				f();
			}
		});

		$('.link-twitter, .link-youtube').mouseover(function () {
			Pentagram.playSound(0);
		});

		$('.link-gplus, .link-lab').mouseover(function () {
			Pentagram.playSound(1);
		});

		$('.link-github').mouseover(function () {
			Pentagram.playSound(2);
		});

		$('.link-blog, #prev, #prev2').mouseover(function () {
			Pentagram.playSound(3);
		});

		$('.link-facebook').mouseover(function () {
			Pentagram.playSound(4);
		});

		$('.link-mail, .link-micronode').mouseover(function () {
			Pentagram.playSound(5);
		});

		$('.link-linkedin').mouseover(function () {
			Pentagram.playSound(6);
		});

		$('#next, #next2, #next3').mouseover(function () {
			Pentagram.playSound(7);
		});

		_annoyingSound = jsfxlib.createWave(['square', 0.0000, 0.3000, 0.1670, 0.6220, 0.0000, 0.9060, 95.0000, 156.0000, 134.0000, 0.1860, -0.4420, 0.1040, 24.8688, 0.0003, 0.0000, 0.0000, 0.0000, 0.0145, 0.0000, 0.0000, -0.0040, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
		_confirmSound = jsfxlib.createWave(['square', 0.0000, 0.1000, 0.0000, 0.0660, 0.5970, 0.4440, 20.0000, 897.0000, 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.5220, 0.2800, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	};

	return {
		init: function () {
			_initArrowButtons();
			_initSounds();
			_initMailForm();
			Pentagram.init(_NOTES_CDEFGABC, _musicTrigger);

			_disc.draggable({
				handle: '.link-wheel',
				containment: 'window'
			});

			_reader.droppable({
				accept: '.disc',
				tolerance: 'fit',
				drop: function () {
					_reader.addClass('reader-disc-in');
					_linkWheelHandle.addClass('fa-upload');
					_linkWheelHandle.removeClass('fa-arrows');
					_disc.addClass('on-reader');
					_isDropped = true;
					if (_confirmSound.play) {
						_confirmSound.play();
					}
				},
				out: function () {
					_reader.removeClass('reader-disc-in');
					_linkWheelHandle.removeClass('fa-upload');
					_linkWheelHandle.addClass('fa-arrows');
					_disc.removeClass('on-reader');
					_isDropped = false;
				}
			});

			_discContainerOpener.on('click', function() {
				_discContainer.addClass('disc-container-opener-clicked');
				
				_disc.removeClass('disc-hidden');
				var _pentagramContainer = $('.pentagram-container');
				_pentagramContainer.removeClass('pentagram-container-away');
			});
			
			_discContainer.removeClass('disc-container-away');
			$('.loading').remove();
			$('.menu-state-info').text('is');
		}
	};
})(window.jQuery, window.Modernizr, window.jsfxlib, window.AC.MailForm, window.AC.MusicTrigger, window.AC.Pentagram);