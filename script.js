// Simon: by Jacob Stoebel

var Simon = function() {
    //strict (bool): if we are playing the game in strict mode

    //SET UP
    this.speed = 1000;  //speed of time between moves (in ms)
    this.moves = [];
    //set up sounds
    this.sounds = {};
    for(var i=1; i<=4; i++){
        var baseUrl = "https://s3.amazonaws.com/freecodecamp/simonSound";
        var soundUrl = baseUrl.concat(Number(i)).concat(".mp3");
        var sound = new Audio(soundUrl);
        sound.volume = 1.0
        this.sounds[i] = sound;     
    }

    this.wrongSound = new Audio("http://www.tvdsb.ca/webpages/balestrins/files/voicebuzzer.mp3");

    this.winnerSound = new Audio("http://soundbible.com/grab.php?id=1003&type=mp3")

    //METHODS

    //playback

    this.isStrict = function(){
        return $("#strict-btn").hasClass("active")
    }

    this.flash = function(move){
        //adds flash class to button
        //move(int) index of button to flash

        var btn = "#btn"+move;
        $(btn).addClass("flash"); //add class to light up
    }

    this.endFlash = function(move) {
        //removes a flash for a button
        //move(int) index of button to flash

        var btn = "#btn"+move;
        $(btn).removeClass("flash"); //add class to light up

    }
    this.playbackFlash = function(moveGen){
        //flashes button, plays sound and sets timer. When timer goes off, decide if it should call again.
        //moveGen: generator that traverses the moves array
        //this function is recursive. It uses a generator to determine the next item in the array to act on.
        //when we fall off the end of the array, the method will stop recursing.

        $("simon-btn").removeClass("flash");
        $(".simon-btn").off("click")
        var move_obj = moveGen.next()
        if(move_obj.done == false){

            var move = move_obj.value;
            console.log("flashing "+move);
            var btn = "#btn"+move;
            this.flash(move)
            this.playCorrectSound(move);
            var game = this;
            setTimeout(function(){
                //timer to end current flash
                game.endFlash(move)
                setTimeout(function(){
                    //timer before next flash
                    game.playbackFlash(moveGen)
                }, 200)
            }, this.speed)
        } else {
            this.takeGuess();
        }

    }

    this.playCorrectSound = function(n){
        // n(int): key of sound to play (1-4)
        this.sounds[n].play(); 
    }

    this.playWrongSound = function(){
        this.wrongSound.play();
    }

    this.playWinnerSound = function() {
        this.winnerSound.play();
    }

    this.playback = function(){
        //playback the current set of moves.

        //TODO no button clicks allowed here!

        console.log("starting playback:");
        console.log(this.moves);
        var game = this;

        function* getMove(){
            var mi = 0;
            while(mi < game.moves.length){
                yield game.moves[mi]
                mi++
            }
        }

        var moveGen = getMove();
        this.playbackFlash(moveGen);
    }

    this.allCorrect = function(){
        //determines if each guesss is right

        var game = this;
        return this.guesses.every(function(curr, i){
            return curr == game.moves[i];
        })
    }

    this.playerFlash = function(move){
        //handles button flashing for player clicks
        //button flashes and then unflashes after 100ms 
        //move(int): button to flash

        var game = this;
        this.flash(move)
        setTimeout(function(){
            game.endFlash(move)    
        }, 300)

    }

    this.takeGuess = function(){
        this.guesses = [];
        var game = this;
        $(".simon-btn").on("click", (function(event){
            //add to guesses
            var clicked = event.target.id;
            var btnNum = clicked.match(/\d/)[0];
            game.guesses.push(btnNum)


            //flash the button
            game.playerFlash(btnNum); 

            if (game.allCorrect()){
                //correct!
                game.playCorrectSound(btnNum);

                if (game.guesses.length == game.moves.length){
                    game.levelUp();
                }

            } else {
                //wrong guess!
                game.playWrongSound();
                
                if(game.isStrict()){
                    game.gameOver(false);
                } else {
                    setTimeout(function(){

                        game.playback();
                    }, 1000)
                }
            }

        }).bind(this))
    } 

    this.addStep = function(){
        var step = (Math.floor((Math.random() * 4) + 1));
        this.moves.push(step);
        this.updateCounter(this.moves.length);
        this.playback();
    }


    this.levelUp = function(){
        //advance to next level unless we are on level 20, in which case the player wins!

        console.log("level up!")
        //set display
        switch(this.moves.length) {

            case 20:
                this.gameOver(true);
                return
            case 12:
                this.speed = 250;
                break
            case 8:
                this.speed = 500;
                break
            case 4:
                this.speed = 750;
                break
        }

        //need a 500ms delay here
        console.log("starting delay before next level")
        var game = this;
        setTimeout(function(){
            game.addStep();
        }, 750)

    }

    this.updateCounter = function(n){
        //updates counter with value of n
        $("#display").text(n);
    }

    this.gameOver = function(win){
        //win(bool) if the player won the game

        console.log("GAME OVER!")
        if(win){
            console.log("You win!")
            this.playWinnerSound();
        } else {
            console.log("You lose!")
        }

        setTimeout(function(){
            startGame();
        }, 1000)

        //TODO other clean up needed here
    }

}

function startGame(){
    //start a new game
    var newGame = new Simon();
    newGame.addStep();
}

$(document).ready(function(){

    console.log("ready!")


    // THE ACTUAL GAME

    // handler for start
    $("#start-btn").on("click", function(){
        console.log("start clicked")
        $("#start-btn").off("click")    //can't click again! must use restart
        // var game = new Simon();
        // game.addStep();
        startGame();
    })


    //handler for strict
    $("#strict-btn").on("click", function(){
        $("#strict-btn").toggleClass("active")
    })

    //handler for reset

    $("#reset-btn").on("click", function(){
        // var newGame = new Simon(strict);
        // newGame.addStep();
        startGame();
    })

    //TESTING

    // var game = new Simon(false);
    // game.moves = [1,1,1];
    // game.playback();

})