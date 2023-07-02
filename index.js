let ilikeblackmen = 0
let counter = 0;
let mainmenu_sound = false;

// play sound function
const playSound = function(arg, loop, returnValue) {
    let clickSound = new Audio(arg?.toString());
    let loopSent = loop || false;

    if (clickSound) {
       try {
        clickSound.play();
        if (loopSent === true) clickSound.loop = true;

        return returnValue(true);
       } catch {
        return returnValue(false);
       }
    }
}

// This is the main menu trigger function
const mainMenu_clicking = async function() {
    document.getElementsByClassName("startMenu")[0].style.display = "none";
    document.getElementsByClassName("gamePlay")[0].style.display = "block";

    if (mainmenu_sound === false) {
        playSound("./src/sound/main.mp3", true, (callback_res) => {
            console.log(callback_res)
            mainmenu_sound = callback_res;
        })
    }

    // play the click sound
    playSound("./src/sound/click.mp3", false);
}

// This is the gamePlay trigger function
const gamePlay_clicking = async function() {
    ilikeblackmen++
    counter++;

    if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
        document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${ilikeblackmen}`;
    }

    if (mainmenu_sound === false) {
        playSound("./src/sound/main.mp3", true, (callback_res) => {
            console.log(callback_res)
            mainmenu_sound = callback_res;
        })
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
setTimeout(async () => {
    playSound("./src/sound/main.mp3", true, (callback_res) => {
        console.log(callback_res)
        mainmenu_sound = callback_res;
    })
}, 250);

/* Database method, how to use?
let database_lib = import("./lib");

database_lib.then((func) => {
    func.set(key, value),
    func.delete(key),
    func.has(key),
    func.get(key)
})
*/