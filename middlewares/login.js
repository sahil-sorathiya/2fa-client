const validator = require("validator");

exports.validateLogin = (req, res, next) => {
    const errorArray = [];
    const { email, password } = req.body;
    if (!email) {
        return res.send("Email is required")
    }
    if (!password) {
        return res.send("Password is required")
    }
    if (typeof email !== "string") {
        return res.send("Email must be string")
    }
    if (typeof password !== "string") {
        return res.send("Password must be string")
    }
    const isEmail = validator.isEmail(email)
    if (!isEmail) {
        errorArray.push("Email is not Valid")
    }
    const isPswrd = validator.isStrongPassword(password)
    if (!isPswrd) {
        errorArray.push("Password must be of length 8 and contain one Uppercase, one Lowercase, one special character and one numeric value")
    }
    if (errorArray.length != 0) {
        return res.render("login", { errorArray, successMessage: "", errorMessage: "", body: req.body })
    }
    next();
}