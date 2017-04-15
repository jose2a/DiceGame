 // Function that creates new Die objects
function Die(id, sprint) {
    this.id = id;
    this.sprint = sprint;
    this.value = id;
}

// Model for Die game
var model = {

    dice: [], // Array of dice (1, 2, 3, 4, 5, 6)
    currentDie: null, // Current die (0)

    // Initializing dice array and currentDie
    init: function () {
        this.dice.push(
            new Die(1, 'img/face1.png'),
            new Die(2, 'img/face2.png'),
            new Die(3, 'img/face3.png'),
            new Die(4, 'img/face4.png'),
            new Die(5, 'img/face5.png'),
            new Die(6, 'img/face6.png')
        );

        this.currentDie = this.dice[0];
    }
};

// Controller for Die game
var controller = {

    rollingTimes : 16, // Times the die will be rolled
    timeBetweenRollings : 100,

    // Initializing model and view
    init: function () {
        model.init();
        view.init();
    },

    // Returning current die
    getCurrentDie: function () {
        return model.currentDie;
    },

    // Returning a random die
    getRandomDie: function () {
        return model.dice[Math.floor(Math.random() * 6)];
    },

    // Verifying if the user guess the right face of the die
    verifyWinningNumber: function (userNumber) {

        var self = this;

        if (userNumber < 1 || userNumber > 6) {
            throw new RangeError('The number should be between 1 and 6.');
        }

        if(isNaN(userNumber)) {
            throw new TypeError('Enter only numbers.');
        }

        userNumber = parseInt(userNumber);

        var userChoice = 'You chose: ' + userNumber;
        var gameResult = 'You lost the game. :(';
        var winner = false;
        
        /*
         * Creating the animation in which the die is rolled, and the
         * image is being change to show to the user the status to the user.
         */
        var j = 0;
        var animation = setInterval(function () {

            model.currentDie = self.getRandomDie(); // Getting a random die

            // Showing the status to the user
            view.render(model.currentDie, 'Rolling die...');

            ++j;

            // If we reached the number of times the die is supposed to be rolled
            // we show the result of the game to the user and stop the animation
            if (j == self.rollingTimes) {

                window.clearInterval(animation);

                if (model.currentDie.value === userNumber) {
                    gameResult = 'You won the game. :)';
                    winner = true;
                }
                view.render(model.currentDie, userChoice, gameResult, winner);
            }
        }, self.timeBetweenRollings);
    }
};

// View for Die game
var view = {

    // Initializing the view
    init: function () {
        var self = this;

        // Initializing the UI components and store a reference to them
        self.userNumber = $('#user-number');
        self.dieImg = $('#die-img');
        self.userChoice = $('#user-choice');
        self.gameResult = $('#game-result');
        self.gameError = $('#game-error');
        
        // Preventing the form from being submitted
        $('form:first').on('submit', function (e) {
            e.preventDefault();
            return false;
        });

        // Adding keyup event to userNumber textbox
        // this allows number to be proccesed after pressing enter key
        self.userNumber.on('keyup', function (e) {

            if (e.keyCode == 13) {

                try {
                    controller.verifyWinningNumber(self.userNumber.val());
                }
                catch (e) {
                    self.render(controller.getCurrentDie());
                    self.showError(e.message);
                }
            }
        });

        self.render(controller.getCurrentDie());

    },

    // Rendering the view
    render: function (die, userChoice, gameResult, winner) {

        userChoice = userChoice || '';
        gameResult = gameResult || '';
        winner = winner || false;

        this.userNumber.val('');
        this.userNumber.focus();
        this.gameError.text('');

        this.userNumber.parent('div').removeClass('has-error');
        this.gameResult.removeClass('text-success');        

        if(winner) {
            this.gameResult.addClass('text-success');
        }

        this.dieImg.attr('src', die.sprint);
        this.userChoice.text(userChoice);
        this.gameResult.text(gameResult);
    },

    // Showing the errors that are caught by the try catch block
    showError : function(errorMsg) {
         if(errorMsg) {
            this.userNumber.parent('div').addClass('has-error');
            this.gameError.text(errorMsg);
        }
    }
};

$(document).ready(function() {
    controller.init();
});