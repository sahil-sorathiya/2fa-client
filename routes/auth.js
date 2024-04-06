require('dotenv').config()
const axios = require('axios');
const { validateRegister } = require('../middlewares/register')
const { validateLogin } = require('../middlewares/login');
const express = require('express');
const { forgotPassword } = require('../middlewares/forgotPassword');
const router = express.Router()
const validator = require("validator");


router.get('/register', (req, res) => {
    if (!req.cookies.clientid || !req.cookies.token) {
        return res.render('register', { errorArray: [], errorMessage: "", successMessage: "" })
    }
    return res.redirect('/dashboard')
})

router.get('/login', (req, res) => {
    if (!req.cookies.token || !req.cookies.clientid) {
        return res.render('login', { errorArray: [], successMessage: "", errorMessage: "", body: "" })
    }
    if (req.cookies.successMsg) {
        res.clearCookie('token')
        res.clearCookie('clientid')
        const successMessage = req.cookies.successMsg
        res.clearCookie('successMsg')
        return res.render('login', { successMessage, errorArray: [], errorMessage: "", body: "" })
    }
    return res.redirect('/dashboard')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.clearCookie('clientid')
    return res.redirect('/login')
})

router.post('/register', validateRegister, async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const response = await axios.post(`${process.env.BACKENDSERVER}/auth/register`, { clientname: fullName, email, password })
        if (!response.data.error) {
            const successMessage = response.data.successMessage
            return res.render('register', { errorArray: [], successMessage, errorMessage: "" })
        }
        return res.send("some Unknown error occured");
    } catch (error) {
        if (error.response.data.error) {
            const errorMessage = error.response.data.errorMessage;
            return res.render('register', { errorArray: [], errorMessage, successMessage: "" });
        }
        return res.send(error)
    }
})

router.post('/login', validateLogin, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.BACKENDSERVER}/auth/login`, req.body)
        res.cookie('token', response.data.token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            path: "/"
        })
        res.cookie('clientid', response.data.clientid, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            path: "/"
        })
        return res.redirect('/dashboard')
    } catch (error) {
        if (error.response.data.error) {
            const errorMessage = error.response.data.errorMessage;
            return res.render('login', { errorArray: [], successMessage: "", errorMessage, body: req.body })
        }
        return res.send(error);
    }
})

router.get('/forgotpassword', (req, res) => {
    if (!req.cookies.token || !req.cookies.clientid) {
        return res.render('forgotpassword', { errorArray: [], successMessage: "", errorMessage: "" })
    }
    return res.redirect('/dashboard')
})

router.get('/changepassword', (req, res) => {
    if (!req.cookies.token || !req.cookies.clientid) {
        return res.redirect('/login')
    }
    return res.render('changepassword', { errorArray: [], successMessage: "", errorMessage: "" })
})

router.post('/forgotpassword', forgotPassword, async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios.post(`${process.env.BACKENDSERVER}/auth/forgotpassword`, {
            email, password
        })
        if (!response.data.error) {
            const successMessage = response.data.successMessage
            return res.render('forgotpassword', { successMessage, errorMessage: "" })
        }
        return res.send("some unknown error occured")
    } catch (error) {
        if (error.response.data) {
            const errorMessage = error.response.data.errorMessage
            return res.render('forgotpassword', { successMessage: "", errorMessage })
        }
        return res.send(error)
    }
})

router.post('/changepassword', async (req, res) => {
    try {
        const clientid = req.cookies.clientid;
        const token = "Bearer " + req.cookies.token;
        const currentPassword = req.body.currentPassword
        const newPassword = req.body.newPassword
        const errorArray = [];
        const isPswrd = validator.isStrongPassword(newPassword)
        if (!isPswrd) {
            errorArray.push("Password must be of length 8 and contain one Uppercase, one Lowercase, one special character and one numeric value")
        }
        const isPswrdLength = validator.isLength(newPassword, { min: 8, max: 32 })
        if (!isPswrdLength) {
            errorArray.push("Password length should be between 8 to 32 characters");
        }
        if (errorArray.length != 0) {
            return res.render("changepassword", { errorArray, successMessage: "", errorMessage: "" })
        }
        const response = await axios.post(`${process.env.BACKENDSERVER}/auth/changepassword/${clientid}`, {
            currentPassword, newPassword
        }, {
            headers: {
                "Authorization": token
            }
        })
        const successMessage = response.data.successMessage
        res.cookie('successMsg', successMessage, {
            httpOnly: true,
            maxAge: 60 * 3 * 1000,
            secure: true,
            path: "/"
        })
        return res.redirect('/login')
    } catch (error) {
        if (error.response.data.error) {
            const errorMessage = error.response.data.errorMessage
            return res.render('changepassword', { errorArray: [], successMessage: "", errorMessage })
        }
        return res.send(error);
    }
})

module.exports = router