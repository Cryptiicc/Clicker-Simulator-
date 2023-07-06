const express = require("express")
const app = express();
const crypto = require("crypto");
const rateLimit = require('express-rate-limit')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// encrypt data
const cryptojs = require("crypto-js")
const sha256   = require("crypto-js/sha256.js");
const sha224   = require("crypto-js/sha224");
const sha512   = require("crypto-js/sha512");
const sha384   = require("crypto-js/sha384");

const encrypt_ = async function(valueGiven) {
    // Hash map: base64 > aes > sha256 > sha384 > sha512 > sha224 > sha512 > base64

    const map_1 = await btoa(valueGiven);
    const map_2 = await sha512(map_1);
    const map_3 = await sha256(map_2);
    const map_4 = await sha384(map_3);
    const map_5 = await sha512(map_4);
    const map_6 = await sha224(map_5);
    const map_7 = await sha512(map_6);
    const map_8 = await btoa(map_7);

    return map_8?.toString();
}

// dotenv
require('dotenv').config()
const secret = process.env["secret"];
const database_url = process.env["database_url"];
const authKey = process.env["authKey"]

// database
const database = require("./client.js")(database_url, authKey);
const cors = require('cors');

// Start server
const before_runTime = Date.now();
app.listen(3000, () => console.log(`[clickerSim]: success, took ${Date.now() - before_runTime}ms!`));
app.use(express.json());
app.use(rateLimit({ windowMs: "60000", max: 20, message: "wah chill dude, wanna take a rest." }))

// Error handling
process.on('uncaughtException', function() { /*console.log("[clickerSim]: error found!")*/ })

// whitelisting (prevent 3rd party attack)
app.use(cors({ origin: "https://buttonfrenzy.netlify.app" }))

// Bad json format
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: false,
            data: {},
            message: "request_error"
        })
    }
})

app.post("/signin", (req, res) => {
    if (req && req["body"] && req["body"]["hcaptcha"] && req["body"]["request"]) {
        fetch("https://hcaptcha.com/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } , body: `response=${req["body"]["hcaptcha"]}&secret=${secret}`}).then((res) => res.json()).then((res_json) => {
            if (res_json && res_json["success"] === true) {
                if (req["body"]["request"] && req["body"]["request"]["username"] && req["body"]["request"]["email"] && req["body"]["request"]["password"]) {
                    database.has(`_${req["body"]["request"]["username"]}`, (has_data) => {
                        if (has_data === true) {
                            database.get(`_${req["body"]["request"]["username"]}`, async (data_info) => {
                                const encrypted_email    = await encrypt_(req["body"]["request"]["email"]);
                                const encrypted_password = await encrypt_(req["body"]["request"]["password"]);

                                if (data_info && data_info["password"] && data_info["email"]) {
                                    if (encrypted_email === data_info["email"]) {
                                        if (encrypted_password === data_info["password"]) {
                                            return res.status(200).json({
                                                status: true,
                                                data: { "username": data_info["username"], "cookie": btoa(data_info["cookie"]) },
                                                message: "success"
                                            })
                                        } else {
                                            return res.status(400).json({
                                                status: false,
                                                data: {},
                                                message: "invaild_password"
                                            })
                                        }
                                    } else {
                                        return res.status(400).json({
                                            status: false,
                                            data: {},
                                            message: "invaild_email"
                                        })
                                    }
                                } else {
                                    return res.status(400).json({
                                        status: false,
                                        data: {},
                                        message: "no_data"
                                    })
                                }
                            })
                        } else if (has_data === false) {
                            return res.status(400).json({
                                status: false,
                                data: {},
                                message: "user_not_exist"
                            })
                        }
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        data: {},
                        message: "no_request"
                    })
                }
            } else {
                return res.status(400).json({
                    status: false,
                    data: {},
                    message: "captcha_failed"
                })
            }
        })
    } else {
        return res.status(400).json({
            status: false,
            data: {},
            message: "missing_data"
        })
    }
})

app.post("/signup", (req, res) => {
    if (req && req["body"] && req["body"]["hcaptcha"] && req["body"]["request"]) {
        fetch("https://hcaptcha.com/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } , body: `response=${req["body"]["hcaptcha"]}&secret=${secret}`}).then((res) => res.json()).then((res_json) => {
            if (res_json && res_json["success"] === true) {
                if (req["body"]["request"] && req["body"]["request"]["username"] && req["body"]["request"]["email"] && req["body"]["request"]["password"]) {
                    database.has(`_${req["body"]["request"]["username"]}`, async (has_data) => {
                        if (has_data === true) {
                            return res.status(400).json({
                                status: false,
                                data: {},
                                message: "user_exist"
                            })
                        } else if (has_data === false) {
                            const generatedCookie = crypto.randomBytes(100).toString('base64url');

                            const ip_ = await req["headers"]['x-forwarded-for']?.toString() ? btoa(btoa(btoa(btoa(btoa(btoa(req["headers"]['x-forwarded-for']?.toString())))))) : null;

                            const encrypted_email    = await encrypt_(req["body"]["request"]["email"]);
                            const encrypted_password = await encrypt_(req["body"]["request"]["password"]);
                            const encrypted_ip       = await ip_ ? encrypt_(ip_) : null

                            database.set(`_${req["body"]["request"]["username"]}`, { "username": req["body"]["request"]["username"], "email": encrypted_email?.toString(), "password": encrypted_password?.toString(), "cookie": `DO_NOT_SHARE_THIS_IF_YOU_SHARE_THIS_YOU_ARE_GIVING_ATTACKER_ACCESS_TO_YOUR_ACCOUNT________________|${generatedCookie}`, "ip": encrypted_ip?.toString(), "createdAt": Date.now(), "click": 0 }, (data_return) => {
                                if (data_return !== false) {
                                    return res.status(200).json({
                                        status: true,
                                        data: { "username": req["body"]["request"]["username"]?.toString(), "cookie": btoa(`DO_NOT_SHARE_THIS_IF_YOU_SHARE_THIS_YOU_ARE_GIVING_ATTACKER_ACCESS_TO_YOUR_ACCOUNT________________|${generatedCookie}`) },
                                        message: "success"
                                    })
                                } else if (data_return === false) {
                                    return res.status(400).json({
                                        status: false,
                                        data: {},
                                        message: "failed"
                                    })
                                }
                            })
                        }
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        data: {},
                        message: "no_request"
                    })
                }
            } else {
                return res.status(400).json({
                    status: false,
                    data: {},
                    message: "captcha_failed"
                })
            }
        })
    } else {
        return res.status(400).json({
            status: false,
            data: {},
            message: "missing_data"
        })
    }
})

app.post("/getClick", (req, res) => {
    if (req && req["body"] && req["body"]["username"]) {
        database.has(`_${req["body"]["username"]}`, (hasValue) => {
            if (hasValue === true) {
                database.get(`_${req["body"]["username"]}`, (value_get) => {
                    if (value_get && value_get["click"] !== undefined) {
                        return res.status(200).json({
                            status: true,
                            data: { "click": Number(value_get["click"]) },
                            message: "success"
                        })
                    } else {
                        return res.status(400).json({
                            status: false,
                            data: {},
                            message: "missing_clickInfo"
                        })
                    }
                })
            } else if (hasValue === false) {
                return res.status(400).json({
                    status: false,
                    data: {},
                    message: "invaild_user"
                })
            }
        })
    } else {
        return res.status(400).json({
            status: false,
            data: {},
            message: "missing_data"
        })
    }
})

app.post("/postClick", (req, res) => {
    if (req && req["body"] && req["body"]["username"] && req["body"]["cookie"] && req["body"]["clicked"] !== undefined && req["body"]["clicked"] !== null) {
        if (Number(req["body"]["clicked"])) {
            if (Number(req["body"]["clicked"]) <= 1620) {
                database.has(`_${req["body"]["username"]}`, (hasValue) => {
                    if (hasValue === true) {
                        database.get(`_${req["body"]["username"]}`, (value_get) => {
                            if (req["body"]["cookie"] === value_get["cookie"]) {
                                let old_storedValue = value_get;
                                old_storedValue["click"] = value_get["click"] += Number(req["body"]["clicked"]);
                                database.set(`_${req["body"]["username"]}`, old_storedValue, (value_set) => {
                                    if (value_set !== false) {
                                        return res.status(200).json({
                                            status: true,
                                            data: { "click": value_set["data"]["click"] },
                                            message: "success"
                                        })
                                    } else if (value_set === false) {
                                        return res.status(400).json({
                                            status: false,
                                            data: {},
                                            message: "failed"
                                        })
                                    }
                                });
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    data: {},
                                    message: "wrong_authentication"
                                })
                            }
                        })
                    } else if (hasValue === false) {
                        return res.status(400).json({
                            status: false,
                            data: {},
                            message: "invaild_user"
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    status: false,
                    data: {},
                    message: "reached_maxLimit"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                data: {},
                message: "invaild_data"
            })
        }
    } else {
        return res.status(400).json({
            status: false,
            data: {},
            message: "missing_data"
        })
    }
})
