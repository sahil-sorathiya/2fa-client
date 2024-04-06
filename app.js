require('dotenv').config()
const apiRoutes = require('./routes/api')
const domainRoutes = require('./routes/domain')
const authRoutes = require('./routes/auth')
const otpRoutes = require('./routes/otp')
const axios = require('axios');
const cookieParser = require('cookie-parser')
const express = require('express')
const bodyParser = require('body-parser')
const { isLoggedIn } = require('./middlewares/isLoggedIn');
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/', domainRoutes)
app.use('/', authRoutes)
app.use('/', apiRoutes)
app.use('/', otpRoutes)

app.get('/', (req, res) => {
    return res.render('homePage')
})

app.get('/dashboard', async (req, res) => {
    const clientid = req.cookies.clientid;
    const token = req.cookies.token;
    if (!clientid || !token) {
        return res.redirect('/login')
    }
    try {
        const clientid = req.cookies.clientid;
        const token = "Bearer " + req.cookies.token;
        const response = await axios.get(`${process.env.BACKENDSERVER}/client/dashboard/${clientid}`, {
            headers: {
                "Authorization": token
            }
        })
        const clientname = response.data.clientData.clientname;
        const domains = response.data.clientData.domains;
        if (req.cookies.errorMessage) {
            const errorCookie = req.cookies.errorMessage;
            res.clearCookie('errorMessage');
            return res.render('dashboard', { verificationErrorMsg: "", errorMessage: errorCookie, clientname, domains })
        }
        if (req.cookies.verificationErrorMsg) {
            const verificationErrorMsg = JSON.parse(req.cookies.verificationErrorMsg)
            res.clearCookie('verificationErrorMsg');
            return res.render('dashboard', { verificationErrorMsg, errorMessage: "", clientname, domains })
        }
        return res.render('dashboard', { verificationErrorMsg: "", errorMessage: "", clientname, domains })
    } catch (error) {
        if (error.response.data.error) {
            return res.redirect('/logout')
        }
        return res.send(error);
    }
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening`)
})