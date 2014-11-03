(function($, Modernizr, App) {

    if (Modernizr.touch) {
        $.prototype.mouseover = function(data, fn) {
            return arguments.length > 0 ? this.on('touchstart', null, data, fn) : this.trigger('mouseover');
        };
    }

    App.init();
    
})(window.jQuery, window.Modernizr, window.AC.App);