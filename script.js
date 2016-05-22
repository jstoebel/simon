// Simon: by Jacob Stoebel

var Simon = function(strict) {
    //strict (bool): if we are playing the game in strict mode

    //SET UP
    this.strict = strict;
    this.speed = 1000;  //speed of time between moves (in ms)
    this.moves = [];

    //METHODS

    //add step

    this.addStep = function(){
        var step = (Math.floor((Math.random() * 4) + 1)) - 1;
        this.moves.push(step);
        this.playback();
    }

    //playback

    this.flash = function(btn){
        //button flashes on and plays its sound and then after this.speed turns off
        //btn(integer): index of button to flash


        $(btn).toggleClass("flash") //add class to light up
        setTimeout(function(){
            $(btn).toggleClass("flash") //turn flash off
        }, this.speed)
    }

    this.playCorrectSound = function(btn){
        //plays the button's correct sound
        //btn(integer): index of button to play sound for
        var baseUrl = "https://s3.amazonaws.com/freecodecamp/simonSound";
        var soundUrl = baseUrl.concat(btn+1).concat(".mp3");
        var sound = new Audio(soundUrl);
        sound.play();
    }

    this.playWrongSound = function(){
        var sound = new Audio("http://www.tvdsb.ca/webpages/balestrins/files/voicebuzzer.mp3");
        sound.play();
    }

    this.playback = function(){
        //playback the current set of moves.

        //TODO no button clicks allowed here!

        for(var m=0; m<this.moves.length; m++){
            var move = this.moves[m];
            var btn = "#btn"+move
            this.flash(btn);
        }

        this.takeGuess();
    }

    this.allCorrect = function(){
        //determines if each guesss is right

        return this.guesses.every(function(curr, i){
            return curr == this.moves[i];
        })
    }

    this.takeGuess = function(){
        this.guesses = [];
        $(".simon-btn").on("click", function(event){
            //add to guesses
            var clicked = event.target.id;
            var btnNum = clicked.match(/\d/)[0];
            this.guesses.push(btnNum)
            this.flash(btnNum);
            if (this.allCorrect()){
                //correct!

                this.playCorrectSound(btnNum);
                if (this.guesses.length == this.moves.length){
                    this.levelUp();
                }

            } else {
                //got something wrong!
                this.playWrongSound();
                
                if(this.strict){
                    this.gameOver(false);
                } else {
                    this.playback();
                }
            }

        }).bind(this)
    } 


    this.levelUp = function(){
        //advance to next level unless we are on level 20, in which case the player wins!

        switch(this.moves.length) {

            case 20:
                this.gameOver(true);
                break
            case 12:
                this.speed = 125;
                break
            case 8:
                this.speed = 250;
                break
            case 4:
                this.speed = 500;
                break
        }
    }

    //update counter

    this.updateCounter = function(n){
        //updates counter with value of n
        $("#display").text(n);
    }

    this.gameOver = function(win){
        //win(bool) if the player won the game

        console.log("GAME OVER!")
        if(win){
            console.log("You win!")
        } else {
            console.log("You lose!")
        }
    }

}

$(document).ready(function(){

    //handler for start
    $("#start-btn").on("click", function(){

        $("#start-btn").off("click")    //can't click again! must use restart
        var strict = $("#strict-btn").hasClass("active")
        var game = new Simon(strict);
        game.addStep();
    })


    //handler for strict
    $("#strict-btn").on("click", function(){
        $("#strict-btn").toggleClass("active")
    })

    //handler for reset

    $("#reset-btn").on("click", function(){

        $("#display").text(0);

        var strict = $("#strict-btn").hasClass("active")
        var newGame = new Simon(strict);
        game.addStep();
    })


})