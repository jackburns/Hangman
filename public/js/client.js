"use strict";

var Hangman = (function () {
    var canvasContext = null,
        guessedLetters = [],
        remainingAttempts = null,
        validList = [],
        gameStats = null;

    function init() {
        canvasContext = $('#hangman-canvas')[0].getContext('2d');
        inputHandler();
    }

    function renderGuessedLetters() {
        if (guessedLetters) {
            $('#hangman-letters').text('Guessed Letters: ' + guessedLetters.join(', '))
        }
    }

    function renderRemainingAttempts() {
        if (remainingAttempts) {
            $('#remaining-attempts').text('Remaining Attempts: ' + remainingAttempts);
        }
    }

    function renderGameStats() {
        if (gameStats) {
            $('.games-won').text('Games Won: ' + gameStats.won);
            $('.games-lost').text('Games Lost: ' + gameStats.lost);
        }
    }

    function getGame() {
        $.getJSON('/game', function (json) {
            var i,
                divTemplate = $('<div>', {class: 'letter blank'}),
                divClone,
                container = $('#hangman-word');

            guessedLetters = json.guessedLetters;
            remainingAttempts = json.remainingAttempts;
            validList = json.validList;
            gameStats = json.gameStats;


            for (i = 0; i < validList.length; i++) {
                divClone = divTemplate.clone();
                divClone.text(validList[i]);
                container.append(divClone);
            }

            renderGuessedLetters();
            renderRemainingAttempts();
            renderGameStats();
            hang(remainingAttempts);
        });
    }

    function inputHandler() {
        var letterInput = $('#letter-input');
        letterInput.on('input', function () {
            var letter = $(this).val().toUpperCase();

            if (letter.match(/^[A-Z]$/)) {
                letterInput.removeClass('error');
                sendLetter(letter);
            } else {
                letterInput.addClass('error');
            }

            $(this).select();
        });
    }

    function renderWin() {
        canvasContext.font = '48px Arial';
        canvasContext.lineWidth = 3;
        canvasContext.fillStyle = 'green';
        canvasContext.fillText('You won!', 0, 120);

        canvasContext.font = '24px Arial';
        canvasContext.lineWidth = 3;
        canvasContext.fillStyle = 'orange';
        canvasContext.fillText('Refresh to play again!', 10, 160);
    }

    function hang(threshold) {
        if (remainingAttempts === 9 || threshold <= 9) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(0, 250);
            canvasContext.lineTo(100, 250);
            canvasContext.stroke();
        }

        if (remainingAttempts === 8 || threshold <= 8) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(50, 250);
            canvasContext.lineTo(50, 25);
            canvasContext.stroke();
        }

        if (remainingAttempts === 7 || threshold <= 7) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(50, 25);
            canvasContext.lineTo(200, 25);
            canvasContext.stroke();
        }

        if (remainingAttempts === 6 || threshold <= 6) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(200, 25);
            canvasContext.lineTo(200, 50);
            canvasContext.stroke();
        }

        if (remainingAttempts === 5 || threshold <= 5) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.arc(200, 75, 25, 2 * Math.PI, 0);
            canvasContext.stroke();
        }

        if (remainingAttempts === 4 || threshold <= 4) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(200, 100);
            canvasContext.lineTo(200, 155);
            canvasContext.stroke();
        }

        if (remainingAttempts === 3 || threshold <= 3) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 3;
            canvasContext.moveTo(200, 100);
            canvasContext.lineTo(175, 125);
            canvasContext.stroke();
        }

        if (remainingAttempts === 2 || threshold <= 2) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 3;
            canvasContext.moveTo(200, 100);
            canvasContext.lineTo(225, 125);
            canvasContext.stroke();
        }

        if (remainingAttempts === 1 || threshold <= 1) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(200, 150);
            canvasContext.lineTo(175, 175);
            canvasContext.stroke();
        }

        if (remainingAttempts === 0 || threshold <= 0) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            canvasContext.moveTo(200, 150);
            canvasContext.lineTo(225, 175);
            canvasContext.stroke();

            canvasContext.font = 'bold 48px Arial';
            canvasContext.lineWidth = 3;
            canvasContext.fillStyle = 'red';
            canvasContext.fillText('You lost!', 0, 120);

            canvasContext.font = 'bold 24px Arial';
            canvasContext.fillStyle = 'orange';
            canvasContext.fillText('Refresh to play again!', 10, 160);
        }
    }

    function sendLetter(letter) {
        $.post('/letter/' + letter, function (json) {
            var i,
                div,
                container = $('#hangman-word');

            guessedLetters = json.guessedLetters;
            remainingAttempts = json.remainingAttempts;
            validList = json.validList;
            gameStats = json.gameStats;

            // if valid re-render
            if (json.valid) {
                for (i = 0; i < json.validList.length; i++) {
                    if (json.validList[i]) {
                        div = container.children().eq(i);

                        div.text(json.validList[i]);
                        div.removeClass('blank');
                    }
                }
            } else {
                hang();
            }

            renderRemainingAttempts();
            renderGuessedLetters();
            renderGameStats();

            if (json.isGameOver && json.gameOverType === 'win') {
                renderWin();
            }
        });
    }

    return {
        init: init,
        getGame: getGame
    };

}());

$(function () {
    Hangman.init();
    Hangman.getGame();
});