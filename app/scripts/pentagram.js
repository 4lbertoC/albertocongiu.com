window.AC.Pentagram = (function ($, jsfxlib) {
	'use strict';

	//
	// Constants
	//
	var _NOTE_DISTANCE = 15;
	var _MAX_NOTES = 10;
	var _NOTE_START_TOP = 3;

	//
	// Reference to the DOM nodes.
	//
	var _pentagram = $('.pentagram');
	var _pentagramLines = _pentagram.children();
	var _numLines = _pentagramLines.length;

	//
	// Other variables.
	//
	var _curPosition = 40;
	var _addedNotes = [];
	// var _currentSong = '';
	// var _currentSongQueue = [];
	// var _isStopped = true;
	// var _isLoop = false;
	// var _time = 500;
	var _sineSounds, lastPlayedSoundId;
	var _musicTrigger;

	var _createSounds = function (type, notes) {
		// Create the audio elements for the given notes.
		var soundArray = [];
		var soundType = type || 'sine';

		$.each(notes, function (i, note) {
			var sound = jsfxlib.createWave([soundType, 4.0000, 0.0700, 0.1600, 0.0000, 0.0000, 0.7380, note, note, note, -1.0000, -1.0000, 0.0000, 0.0100, -0.3000, -1.0000, -0.6480, 0.0000, 0.5000, -0.5840, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
			soundArray.push(sound);
		});
		return soundArray;
	};

	var _shiftNotes = function () {
		var firstNote = _addedNotes.shift();
		firstNote.remove();
		$.each(_addedNotes, function (i, note) {
			note.css('left', (parseInt(note.css('left')) - _NOTE_DISTANCE) + 'px');
		});
		_curPosition -= _NOTE_DISTANCE;
	};

	return {
		addNote: function (noteId) {
			if (noteId >= 0 && noteId < _numLines) {
				var noteClass = noteId === '0' ? 'fa fa-minus-circle' : 'fa fa-circle';
				var newNote = $('<i class="' + noteClass + ' pentagram-note"></i>');
				newNote.css({
					left: _curPosition + 'px',
					top: (_NOTE_START_TOP + (_numLines - noteId) * 5.7) + 'px'
				});
				_curPosition += _NOTE_DISTANCE;
				newNote.appendTo(_pentagramLines[_numLines - noteId - 1]);
				_addedNotes.push(newNote);
				while (_addedNotes.length > _MAX_NOTES) {
					_shiftNotes();
				}
			}
		},

		// clear: function () {
		// TODO
		// },

		init: function (notes, musicTrigger) {
			_sineSounds = _createSounds('sine', notes);
			_musicTrigger = musicTrigger;
		},

		// _innerPlaySong: function () {
		// 	if (!_isStopped && _currentSong.length > 0) {
		// 		if (_currentSongQueue.length === 0) {
		// 			if (!_isLoop) {
		// 				_isStopped = true;
		// 				return;
		// 			}
		// 			_currentSongQueue = _currentSong.split('');
		// 		}
		// 		this.playSound(parseInt(_currentSongQueue.shift()));
		// 		var that = this;
		// 		setTimeout(function () {
		// 			that._innerPlaySong.apply(that);
		// 		}, _time);
		// 	}
		// },

		// playSong: function (notes, loop, time) {
		// 	if (typeof notes === 'string') {
		// 		_currentSong = notes;
		// 		_currentSongQueue = notes.split('');
		// 		_isLoop = loop || false;
		// 		_time = time || 500;
		// 		_isStopped = false;
		// 		this._innerPlaySong();
		// 	}
		// },

		playSound: function (soundId) {
			if (typeof lastPlayedSoundId === 'number' && !_sineSounds[soundId].paused) {
				_sineSounds[soundId].pause();
				_sineSounds[soundId].currentTime = 0;
			}
			lastPlayedSoundId = soundId;
			_sineSounds[soundId].play();
			_musicTrigger.pushSound(soundId.toString());
			this.addNote(soundId.toString());
		},

		// removeNote: function () {
		// TODO
		// },

		// stop: function () {
		// 	_isStopped = true;
		// }



	};
})(window.jQuery, window.jsfxlib);