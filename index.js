const express = require("express")
const app = express();
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// dotenv
require('dotenv').config();
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

// Error handling
process.on('uncaughtException', function() { /*console.log("[clickerSim]: error found!")*/ })

// whitelisting (prevent 3rd party attack)
app.use(cors({ origin: "http://127.0.0.1:5500", referer: 'http://127.0.0.1:5500/' }))

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
        fetch("https://hcaptcha.com/siteverify", { method: "POST", body: `response=${req["body"]["request"]}&secret=${secret}`}).then((res) => res.json()).then((res_json) => {
            if (res_json) {
                if (req["body"]["request"] && req["body"]["request"]["username"] && req["body"]["request"]["email"] && req["body"]["request"]["password"]) {
                    database.has(`_${req["body"]["request"]["username"]}`, (has_data) => {
                        if (has_data === true) {
                            database.get(`_${req["body"]["request"]["username"]}`, (data_info) => {
                                if (data_info && data_info["password"] && data_info["email"]) {
                                    if (req["body"]["request"]["email"] === data_info["email"]) {
                                        if (req["body"]["request"]["password"] === data_info["password"]) {
                                            return res.status(200).json({
                                                status: true,
                                                data: { "username": data_info["username"], "cookie": data_info["cookie"] },
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
                            const generatedCookie = crypto.randomBytes(100).toString('base64url');
                            database.set(`_${req["body"]["request"]["username"]}`, { "username": req["body"]["request"]["username"], "email": req["body"]["request"]["email"], "password": req["body"]["request"]["password"], "cookie": `DO_NOT_SHARE_THIS_IF_YOU_SHARE_THIS_YOU_ARE_GIVING_ATTACKER_ACCESS_TO_YOUR_ACCOUNT________________|${generatedCookie}`, "ip": req["headers"]['x-forwarded-for']?.toString() ? req["headers"]['x-forwarded-for']?.toString() : null, "click": 0 }, (data_return) => {
                                return res.status(200).json({
                                    status: true,
                                    data: { "username": req["body"]["request"]["username"]?.toString(), "cookie": `DO_NOT_SHARE_THIS_IF_YOU_SHARE_THIS_YOU_ARE_GIVING_ATTACKER_ACCESS_TO_YOUR_ACCOUNT________________|${generatedCookie}` },
                                    message: "success"
                                })
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
                    if (value_get && value_get["click"] && Number(value_get["click"])) {
                        return res.status(200).json({
                            status: true,
                            data: { "click": Number(value_get["click"]) },
                            message: "success"
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
    }
})

app.post("/postClick", (req, res) => {
    if (req && req["body"] && req["body"]["username"] && req["body"]["cookie"] && req["body"]["clicked"] && Number(req["body"]["clicked"])) {
        if (Number(req["body"]["clicked"]) <= 1620) {
            database.has(`_${req["body"]["username"]}`, (hasValue) => {
                if (hasValue === true) {
                    database.get(`_${req["body"]["username"]}`, (value_get) => {
                        if (req["body"]["cookie"] === value_get["cookie"]) {
                            database.set(`_${req["body"]["username"]}`, { "username": value_get["username"], "email": value_get["email"], "password": value_get["password"], "cookie": value_get["cookie"], "ip": req["headers"]['x-forwarded-for']?.toString() ? req["headers"]['x-forwarded-for']?.toString() : null, "click": value_get["click"] += Number(req["body"]["clicked"]) }, (value_set) => {
                                return res.status(200).json({
                                    status: true,
                                    data: { "click": value_set["data"]["click"] },
                                    message: "success"
                                })
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
            message: "missing_data"
        });
    }
})
