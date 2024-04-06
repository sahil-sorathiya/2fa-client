require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require('axios');


router.get('/apikeys', async (req, res) => {
    try {
        const token = 'Bearer ' + req.cookies.token;
        const response = await axios.get(`${process.env.BACKENDSERVER}/api/getapikey/${req.cookies.clientid}`, {
            headers: {
                "Authorization": token
            }
        })
        const clientName = response.data.clientname;
        const apiKey = response.data.apiKey;
        const generatedAt = response.data.generatedAt;
        if (req.cookies.errorMsg) {
            const errorMessage = req.cookies.errorMsg;
            res.clearCookie('errorMsg')
            return res.render('apikeys', { clientName, apiKey, generatedAt, errorMessage })
        }
        return res.render('apikeys', { clientName, apiKey, generatedAt, errorMessage: "" })
    } catch (error) {
        if (error.response.data.error) {
            return res.redirect('/logout');
        }
        return res.send(error)
    }
})

router.get('/addapi', async (req, res) => {
    try {
        const token = 'Bearer ' + req.cookies.token;
        const response = await axios.get(`${process.env.BACKENDSERVER}/api/generateapikey/${req.cookies.clientid}`, {
            headers: {
                "Authorization": token
            }
        })
        return res.redirect('/apikeys')
    } catch (error) {
        if (error.response.data.error) {
            const errorMsg = error.response.data.errorMessage;
            res.cookie('errorMsg', errorMsg, {
                httpOnly: true,
                maxAge: 60 * 1000,
                secure: true,
                path: "/"
            });
            return res.redirect('/apikeys')
        }
    }
})

router.get('/deleteapi', async (req, res) => {
    try {
        const clientid = req.cookies.clientid;
        const token = "Bearer " + req.cookies.token;
        const response = await axios.delete(`${process.env.BACKENDSERVER}/api/deleteapikey/${clientid}`, {
            headers: {
                "Authorization": token
            }
        })
        return res.redirect('/apikeys')
    } catch (error) {
        if (error.response.data.error) {
            return res.send(error.response.data)
        }
        return res.send(error)
    }
})
module.exports = router
