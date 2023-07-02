let ilikeblackmen = 0
let counter = 0;

// This is the main menu trigger function
const mainMenu_clicking = function() {
    document.getElementsByClassName("startMenu")[0].style.display = "none";
    document.getElementsByClassName("gamePlay")[0].style.display = "block";

    // play the click sound
    playSound("./src/sound/click.mp3", false);
}

// play sound function
const playSound = function(arg, loop) {
    let clickSound = new Audio(arg?.toString());
    let loopSent = loop || false;

    if (clickSound) {
        clickSound.play();

        if (loopSent === true) clickSound.loop = true;
    }
}

// This is the gamePlay trigger function
const gamePlay_clicking = function() {
    ilikeblackmen++
    counter++;

    if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
        document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${ilikeblackmen}`;
    }

    // play the click sound
    playSound("./src/sound/click.mp3", false);
}

const anti_cheat = function() {
    if (counter >= 25) {
        alert("You're cheating!")
    }

    counter = 0;

    setTimeout(() => {
        anti_cheat()
    }, 1000);
}

anti_cheat();

// playing the game music
playSound("./src/sound/main.mp3", true);

/* Database method, how to use?
let database_lib = import("./lib");

database_lib.then((func) => {
    func.set(key, value),
    func.delete(key),
    func.has(key),
    func.get(key)
})
*/