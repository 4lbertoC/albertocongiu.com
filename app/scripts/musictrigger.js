window.AC.MusicTrigger = (function ($) {
	'use strict';

	var _MAX_QUEUE_LENGTH = 10;
	var _MAX_PLAYABLE_NOTES = 8;

	var _notesCount = [];
	var _cmaj7Shown = false;
	var _notesPlayed = $('.notes-played').children();

	// Checks whether the string matches with any of the given patterns.
	var _innerMatch = function (strLen, string, patterns) {
		var len = string.length;
		var shortenedString = string.substring(len - strLen, len);

		return ($.inArray(shortenedString, patterns) !== -1) ? shortenedString : '';
	};

	var _checkAllNotesPlayed = function(soundCode) {
		if(_cmaj7Shown) {
			return;
		}

		var position = +soundCode;

		if(!_notesCount[position]) {
			_notesCount[position] = 0;
			$(_notesPlayed.get(position)).addClass('on');
		}
		_notesCount[position]++;

		if(_MAX_PLAYABLE_NOTES && _notesCount.length === _MAX_PLAYABLE_NOTES) {
			for(var i = 0; i < _MAX_PLAYABLE_NOTES; i++) {
				if(_notesCount[i] === undefined) {
					return;
				}
			}
			_showCmaj7();
		}
	};

	var _showCmaj7 = function() {
		$('.cmaj').removeClass('moved-up');
		$('.cmaj').removeClass('hidden');
		_cmaj7Shown = true;
	};

	var MusicTrigger = function (optNotes) {
		this._PATTERN_MAP = optNotes instanceof Object ? optNotes : {};
		this._soundQueue = '';
		this._listenerMap = [];
	};
	MusicTrigger.prototype = {
		addListener: function (callback) {
			var listenerId;
			if (typeof callback === 'function') {
				listenerId = this._listenerMap.length;
				this._listenerMap.push(callback);
			}
			return listenerId;
		},

		match: function () {
			var found = '';
			for (var patternLength in this._PATTERN_MAP) {
				found = _innerMatch(patternLength, this._soundQueue, this._PATTERN_MAP[patternLength]);
				if (found !== '') {
					return found;
				}
			}
			return found;
		},

		pushSound: function (soundCode) {
			if (typeof soundCode === 'string') {
				_checkAllNotesPlayed(soundCode);

				this._soundQueue += soundCode;
				var qLen = this._soundQueue.length;
				if (qLen > _MAX_QUEUE_LENGTH) {
					this._soundQueue = this._soundQueue.substring(qLen - _MAX_QUEUE_LENGTH, qLen);
				}
				var match = this.match();
				if (match !== '' && this._listenerMap.length > 0) {
					$.each(this._listenerMap, function (i, listener) {
						listener(match);
					});
				}
			}
		},

		removeListener: function (listenerId) {
			if (typeof listenerId === 'number' && listenerId >= 0 && listenerId < this._listenerMap.length) {
				this._listenerMap.splice(listenerId, 1);
				return true;
			}
			return false;
		},

		reset: function () {
			this._soundQueue = '';
		},

		setPatternMap: function (patternMap) {
			if (patternMap instanceof Object) {
				this._PATTERN_MAP = patternMap;
			}
		}
	};

	return MusicTrigger;
})(window.jQuery);