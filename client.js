// const db = "the database address here or env key direct to the database address";
// const authkey = "the auth key like a password here!";

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = function(db, authkey) {
    return {
        set(key, value, callback) {
            try {
                if (db) {
                    let bodyfetch = {
                        "authorization": authkey,
                        "key": key,
                        "value": value
                    }
                    fetch(db + "/set", { method: "POST", body: JSON.stringify(bodyfetch), headers: { 'Content-Type': 'application/json' }}).then(res => res.json()).then(json => {
                        if (json) {
                            if (json["status"] === false) return callback(false);
                            if (json["status"] === true) return callback(json);
                        }
                    })
                }
            } catch {
                return callback(false);
            }
        },
        has(key, callback) {
            try {
                if (db) {
                    let bodyfetch = {
                        "authorization": authkey,
                        "key": key
                    }
                    fetch(db + "/has", { method: "POST", body: JSON.stringify(bodyfetch), headers: { 'Content-Type': 'application/json' }}).then(res => res.json()).then(json => {
                        if (json) {
                            if (json["status"] === false) return callback(false);
                            if (json["status"] === true) return callback(true);
                        }
                    })
                }
            } catch {
                return callback(false);
            }
        },
        get(key, callback) {
            try {
                if (db) {
                    let bodyfetch = {
                        "authorization": authkey,
                        "key": key
                    }
                    fetch(db + "/has", { method: "POST", body: JSON.stringify(bodyfetch), headers: { 'Content-Type': 'application/json' }}).then(res => res.json()).then(json => {
                        if (json) {
                            if (json["status"] === false) return callback(false);
        
                            if (json["data"]) {
                                return callback(json["data"]);
                            } else {
                                return callback(undefined);
                            }
                        }
                    })
                }
            } catch {
                return callback(undefined);
            }
        },
        del(key, callback) {
            try {
                let bodyfetch = {
                    "authorization": authkey,
                    "key": key
                }
                if (db) {
                    fetch(db + "/del", { method: "DELETE", body: JSON.stringify(bodyfetch), headers: { 'Content-Type': 'application/json' }}).then(res => res.json()).then(json => {
                        if (json) {
                            if (json["status"] === false) return callback(false);
                            if (json ["status"] === true) return callback(json);
                        }
                    })
                }
            } catch {
                return callback(false);
            }
        },
        clear(key, callback) {
            try {
                let bodyfetch = {
                    "authorization": authkey,
                    "key": key
                }
                if (db) {
                    fetch(db + "/clear", { method: "POST", body: JSON.stringify(bodyfetch), headers: { 'Content-Type': 'application/json' }}).then(res => res.json()).then(json => {
                        if (json) {
                            if (json["status"] === false) return callback(false);
                            if (json ["status"] === true) return callback(json);
                        }
                    })
                }
            } catch {
                return callback(false);
            }
        }
    }
}