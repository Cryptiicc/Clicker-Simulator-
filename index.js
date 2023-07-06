let ilikeblackmen = 0
let counter = 0;
let lastClick_save = 0;
let allowCatching = false;

// play sound function
const playSound = function(arg, loop) {
    let clickSound = new Audio(arg?.toString());
    let loopSent = loop || false;

    if (clickSound) {
       try {
        clickSound.play();
        if (loopSent === true) clickSound.loop = true;

        return true
       } catch {
        return false
       }
    }
}

// This is the main menu trigger function
const mainMenu_clicking = async function() {
    document.getElementsByClassName("startMenu")[0].style.display = "none";
    document.getElementsByClassName("gamePlay")[0].style.display = "block";

    // play the click sound
    playSound("./src/sound/click.mp3", false);
}

// This is the gamePlay trigger function
const gamePlay_clicking = async function() {
    if (allowCatching === true) {
        ilikeblackmen++;
        counter++;
        lastClick_save++;

        if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
            document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${ilikeblackmen}`;
        }

        // play the click sound
        playSound("./src/sound/click.mp3", false);
    }
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

// Getting last play data
fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
    if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
        ilikeblackmen = Number(res_json["data"]["click"]);
        if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
            document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${Number(res_json["data"]["click"])}`;
        }
        lastClick_save = 0;
    } else {
        fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
            if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                ilikeblackmen = Number(res_json["data"]["click"]);
                if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
                    document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${Number(res_json["data"]["click"])}`;
                }
                lastClick_save = 0;
            } else {
                fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                    if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                        ilikeblackmen = Number(res_json["data"]["click"]);
                        if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
                            document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${Number(res_json["data"]["click"])}`;
                        }
                        lastClick_save = 0;
                    }
                })
            }
        })
    }
})

setTimeout(() => {
    fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
        if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
            ilikeblackmen = Number(res_json["data"]["click"]);
            allowCatching = true;
            lastClick_save = 0;
        } else {
            fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                    ilikeblackmen = Number(res_json["data"]["click"]);
                    allowCatching = true;
                    lastClick_save = 0;
                } else {
                    setTimeout(() => {
                        fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                            if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                                ilikeblackmen = Number(res_json["data"]["click"]);
                                allowCatching = true;
                                lastClick_save = 0;
                            } else {
                                setTimeout(() => {
                                    fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                                        if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                                            ilikeblackmen = Number(res_json["data"]["click"]);
                                            allowCatching = true;
                                            lastClick_save = 0;
                                        } else {
                                            setTimeout(() => {
                                                fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                                                    if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                                                        ilikeblackmen = Number(res_json["data"]["click"]);
                                                        allowCatching = true;
                                                        lastClick_save = 0;
                                                    } else {
                                                        setTimeout(() => {
                                                            fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                                                                if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                                                                    ilikeblackmen = Number(res_json["data"]["click"]);
                                                                    allowCatching = true;
                                                                    lastClick_save = 0;
                                                                } else {
                                                                    setTimeout(() => {
                                                                        fetch("https://backend-buttonfrenzy.codernocook.repl.co/getClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"] }) }).then((res) => res.json()).then((res_json) => {
                                                                            if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
                                                                                ilikeblackmen = Number(res_json["data"]["click"]);
                                                                                allowCatching = true;
                                                                                lastClick_save = 0;
                                                                            } else {
                                                                                setTimeout(() => {
                                                                                    
                                                                                }, 250);
                                                                            }
                                                                        })
                                                                    }, 250);
                                                                }
                                                            })
                                                        }, 250);
                                                    }
                                                })
                                            }, 250);
                                        }
                                    })
                                }, 250);
                            }
                        })
                    }, 250);
                }
            })
        }
    })
}, 1000);

// saving data function
const savingData = function() {
    fetch("https://backend-buttonfrenzy.codernocook.repl.co/postClick", { method: "POST", mode: 'cors', headers: { "Accept": "application/json", "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ "username": JSON.parse(document.cookie.split("cookie=")[1])["username"], "cookie": JSON.parse(document.cookie.split("cookie=")[1])["loginCookie"], "clicked": lastClick_save }) }).then((res) => res.json()).then((res_json) => {
        if (res_json && res_json["status"] === true && res_json["data"] && res_json["data"]["click"] !== null && res_json["data"]["click"] !== undefined) {
            ilikeblackmen = Number(res_json["data"]["click"]);
            if (document.getElementsByClassName("clickButton_gamePlay") && document.getElementsByClassName("clickButton")[0] && Number(ilikeblackmen)) {
                document.getElementsByClassName("clickButton_gamePlay")[0].innerHTML = `click! | ${Number(res_json["data"]["click"])}`;
            }
            allowCatching = true;
            lastClick_save = 0;
            return true;
        } else {
            return false;
        }
    })
}

// Saving data loop
const savingData_loop = function() {
    allowCatching = false;

    if (savingData() === false) {
        setTimeout(() => {
            if (savingData() === false) {
                setTimeout(() => {
                    if (savingData() === false) {
                        setTimeout(() => {
                            if (savingData() === false) {
                                setTimeout(() => {
                                    if (savingData() === false) {
                                        setTimeout(() => {
                                            savingData()
                                        }, 250);
                                    }
                                }, 250);
                            }
                        }, 250);
                    }
                }, 250);
            }
        }, 250);
    }

    setTimeout(() => {
        savingData_loop();
    }, 60000);
}

savingData_loop();

// Leaving page detector
window.onbeforeunload = function(event) {
    event.preventDefault();
    allowCatching = false;
    
    if (savingData() === false) {
        setTimeout(() => {
            if (savingData() === false) {
                setTimeout(() => {
                    if (savingData() === false) {
                        setTimeout(() => {
                            if (savingData() === false) {
                                setTimeout(() => {
                                    if (savingData() === false) {
                                        setTimeout(() => {
                                            savingData()
                                        }, 250);
                                    }
                                }, 250);
                            }
                        }, 250);
                    }
                }, 250);
            }
        }, 250);
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