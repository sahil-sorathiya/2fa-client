const validator = require("validator");

exports.forgotPassword = (req, res, next) => {
    const errorArray = [];
    const { email, password } = req.body;
    const isEmail = validator.isEmail(email)
    if (!isEmail) {
        errorArray.push("Email is not Valid")
    }
    const isPswrd = validator.isStrongPassword(password)
    if (!isPswrd) {
        errorArray.push("Password must be of length 8 and contain one Uppercase, one Lowercase, one special character and one numeric value")
    }
    if (errorArray.length != 0) {
        return res.render("forgotPassword", { errorArray, successMessage: "", errorMessage: "" })
    }
    next();
}