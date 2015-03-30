"use strict";

var Hangman = function Hangman(word, guessedLetters, validList, attempts) {
    this.word = word.toUpperCase();

    this.guessedLetters = guessedLetters || [];
    this.validList = validList || new Array(word.length);
    this.attempts = attempts || 0;
};

Hangman.prototype = {
    maxWrongAnswers: 10,

    isGameOver: function () {
        if (this.attempts >= this.maxWrongAnswers) {
            return {
                'isGameOver': true,
                'gameOverType': 'loss'
            };
        } else if (this.validList.join('') === this.word) {
            return {
                'isGameOver': true,
                'gameOverType': 'win'
            };
        } else {
            return {
                'isGameOver': false
            };
        }
    },

    validateLetter: function (letter) {
        var valid = false,
            i;

        letter = letter.toUpperCase();

        // Check if letter has already been guessed
        if (this.guessedLetters.indexOf(letter) === -1) {
            this.guessedLetters.push(letter);

            for (i = 0; i < this.word.length; i++) {
                if (this.word[i] === letter) {
                    valid = true;
                    this.validList[i] = letter;
                }
            }
            if (!valid) {
                this.attempts = this.attempts + 1;
            }
        }

        var response = this.isGameOver();
        response.valid = valid;
        response.validList = this.validList;
        response.guessedLetters = this.guessedLetters;
        response.remainingAttempts = this.maxWrongAnswers - this.attempts;
        return response;
    }
};

module.exports = Hangman;