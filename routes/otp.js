require('dotenv').config()
const axios = require('axios');
const express = require('express');
const cors = require('cors')
const router = express.Router()

router.post('/sendotp', async (req, res) => {
    const { apikey, userEmail, redirectUrl, domainName } = req.body
    try {
        const response = await axios.post(`${process.env.BACKENDSERVER}/otp/sendotp`, {
            clientApiKey: apikey,
            domainname: domainName,
            emailOfUser: userEmail,
            redirectUrl
        })
        if (response.data.error == false) {
            const uuid = response.data.uuid;
            return res.status(200).json({
                success: true,
                error: false,
                redirectTo: `${process.env.FRONTENDSERVER}/otp/${uuid}`,
                message: "Redirect your user to given url which is given as 'redirectTo'"
            });
        }
        return res.status(400).json({
            success: false,
            error: true,
            message: "Some unknown error occured"
        });
    } catch (error) {
        if (error?.response?.data?.error) {
            return res.status(400).json({
                success: false,
                error: true,
                message: error.response.data.errorMessage
            });
        }
        return res.status(400).json({
            success: false,
            error: true,
            message: "Some unknown error occured"
        });
    }
})

router.get('/otp/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const errorMsg = req.cookies.errorMsg;
    if (errorMsg) {
        res.clearCookie('errorMsg')
        return res.render('otp', { uuid, errorMsg })
    }
    res.render('otp', { uuid, errorMsg: "" })
})

router.post('/otp/:uuid', async (req, res) => {
    const otpString = req.body.otpValue;
    const uuid = req.params.uuid;
    try {
        const response = await axios.post(`${process.env.BACKENDSERVER}/otp/verifyotp`, {
            otpString,
            uuid
        })
        return res.redirect(`${response.data.redirectUrl}`)
    } catch (error) {
        if (error.response.data.error) {
            const errorMessage = error.response.data.errorMessage;
            res.cookie('errorMsg', errorMessage, {
                httpOnly: true,
                maxAge: 60 * 1000,
                secure: true,
                path: "/"
            })
            return res.redirect(`/otp/${uuid}`)
        }
        return res.send("unknown error")
    }
})

module.exports = router
