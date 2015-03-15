var Hangman = function (word) {
	this.word = word.toUpperCase();
	this.guessedLetters = [];
};

Hangman.prototype = {
	maxWrongAnswers: 10,

	isGameOver: function() {
		if(this.guessedLetters.length >= this.maxWrongAnswers) {
			return true;
		}
		return false;
	},

	validateLetter: function(letter) {
		letter = letter.toUpperCase();
		var validList = [],
		valid = false,
		i;

		// Check if letter has already been guessed
		if(!guessedLetters.indexOf(letter) > -1) {
			this.guessedLetters.push(letter);
		}
			// Find all indices of letter within word
			for(i = 0; i < word.length; i++) {
				if (word[i] === letter) {
					valid = true;
					validList.push[i + 1];
				}
			}
		return validList;
	}
};

module.exports = Hangman;