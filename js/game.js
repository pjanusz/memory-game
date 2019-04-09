const cards = document.getElementsByClassName('card');
const stars = document.getElementsByClassName('fa-star');
const restart = document.getElementById('restart');
const again = document.getElementById('again');
const grats = document.getElementById('grats');
let moves = document.getElementById('moves');
let scores = document.getElementById('stars-score');
let clear = document.getElementById('clear-time');
let score = 3;
let locked; //locked (guessed) cards
let timer = document.getElementById('timer');
let temp = []; //cards to match (2 in array)
let moveCounter = 0;
let seconds = 0;
let minutes = 0;
let timerOn = false;

function flip() { //flip card and start match() function
    if (!timerOn) {
        timerOn = true;
        time();
    }
    //preventing from flip more than 2 cards and add their "back" to array
    if (temp.length < 2 && !this.classList.contains('show')) {
        this.classList.add('show');
        temp.push(this.childNodes[3].classList.value);
        match();
    } else return;
}

function match() { //function for check if cards match
    if (temp.length != 2) return; //do nothing if one card selected
    else if (temp[0] != temp[1]) {
        setTimeout(function () { //time for the animation ;)
            temp = [];
            for (let card of cards) {
                if (!card.classList.contains('lock')) //don't remove 'show' class from matched cards
                    card.classList.remove('show'); //unflip not matched cards
            }
        }, 1200);
        move();
        star();
    } else if (temp[0] === temp[1]) { //match condition
        setTimeout(function () {
            for (let card of cards) {
                if (card.classList.contains('show')) { //lock matched cards with 'lock' class
                    card.classList.add('lock');
                    temp = []; //zeoring temp. array for new selection
                }
            }
        }, 900);
        move();
        star();
    }
}

function move() { //moves counter for star replacing
    moveCounter++;
    moves.textContent = moveCounter;
}

function star() { //star replacing based on moves and time
    if (moveCounter == 17 || (minutes == 1 && seconds == 15)) {
        stars[stars.length - 1].classList.remove('fas');
        if (score == 3) score--; //protected against setInterval
    }
    if (moveCounter == 21 || (minutes == 2 && seconds === 0)) {
        stars[stars.length - 2].classList.remove('fas');
        if (score == 2) score--;
    }
    if (moveCounter == 25 || (minutes == 2 && seconds == 30)) {
        stars[stars.length - 3].classList.remove('fas');
        if (score === 1) score--;
    }
}

function init() { //shuffle cards and add event listener for all of them
    for (let card of cards) {
        card.addEventListener('click', flip);
        card.style.order = Math.floor(Math.random() * 32) + 1; //random order for cards
    }
}

restart.addEventListener('click', reset); //restart button event listener
again.addEventListener('click', function () { //modal "play again" button event listener
    if (minutes == 4 && seconds === 0) { //if 4 minutes changed modal appear (yoda's wisdom)
        grats.children[1].textContent = 'No! Try not. Do... or do not. There is no try.';
        setTimeout(() => { //es syntax, I left it "as is" on purpose ;)
            reset();
        }, 2000);
    } else reset(); //if time less than 4 minutes just reset
});

function time() { //time count
    let inter = setInterval(function () {
        if (!timerOn) { //stop if false
            clearInterval(inter);
            return;
        }
        seconds++; //second counter
        if (seconds > 59) { //and minutes based on seconds
            minutes++;
            seconds = 0;
        }
        star();
        locked = document.getElementsByClassName('lock'); //locked (matched) cards
        if (minutes === 4 && seconds === 0) { //changed modal (yoda's wisdom)
            clearInterval(inter);
            grats.children[0].textContent = 'AFK are you?';
            grats.children[1].textContent = '';
            grats.children[2].textContent = "Try again.";
            grats.classList.remove('hidden');
        } else if (cards.length === locked.length) { //normal modal
            clearInterval(inter);
            clear.textContent = timer.textContent;
            scores.textContent = score;
            grats.classList.remove('hidden');
        }
        timer.textContent = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2); //display 00:00, when more than ten don't display first 0
    }, 1000);
}

function reset() { //function for reset game (all variables, time, move counter, ets)
    timerOn = false;
    for (let card of cards) { //prevent card animation and click on them
        card.classList.add('animation-off');
        card.classList.remove('show');
        card.classList.remove('lock');
        card.removeEventListener('click', flip); //prevent clicking before set timeout
    }
    for (let star of stars) {
        star.classList.add('fas'); //"fill" stars
    }
    seconds = 0;
    minutes = 0;
    moveCounter = 0;
    moves.textContent = 0;
    score = 3;
    temp = [];
    setTimeout(function () { //timeout for end of function
        for (let card of cards) {
            card.classList.remove('animation-off');
        }
        timer.textContent = '00:00';
        init();
    }, 700);
    if (!grats.classList.contains('hidden')) //if NOT
        grats.classList.add('hidden');
}

init(); //game init (shuffle and give click event for cards) agetr page load