exports.isLoggedIn = (req, res, next) => {
    const clientid = req.cookies.clientid;
    const token = req.cookies.token;
    if (clientid && token) {
        return next();
    }
    return res.redirect('/login')
}