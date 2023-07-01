let ilikeblackmen = 0

// This is the main menu trigger function
const mainMenu_clicking = function() {
    
}

// This is the gamePlay trigger function
const gamePlay_clicking = function() {
    ilikeblackmen++

    if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
        document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${ilikeblackmen}`;
    }
}


/* Database method, how to use?
let database_lib = import("./lib");

database_lib.then((func) => {
    func.set(key, value),
    func.delete(key),
    func.has(key),
    func.get(key)
})
*/