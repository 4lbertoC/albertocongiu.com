window.AC.App = (function ($, wheel) {
	'use strict';
	return {
		init: function () {
			wheel.init();
			$('.minimise').click(function() {
				$('.hello').toggleClass('minimised');
				$('.minimise').toggleClass('fa-minus fa-plus');
			})
		}
	};
})(window.jQuery, window.AC.Wheel);