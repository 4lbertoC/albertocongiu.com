/* global ga */

(function ($, Modernizr, App) {
	'use strict';

    if (Modernizr.touch) {
        $.prototype.mouseover = function(data, fn) {
            return arguments.length > 0 ? this.on('touchstart', null, data, fn) : this.trigger('mouseover');
        };
    }

    $.each($('.hello a'), function(i, el) {
		var $el = $(el);
		var text = $el.text();
		$el.on('click', function() {
			ga('send', 'event', 'Click on Hello Links', text);
		});
    });

    App.init();
    
})(window.jQuery, window.Modernizr, window.AC.App);