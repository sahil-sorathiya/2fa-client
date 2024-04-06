const validator = require('validator');

exports.validateRegister = (req, res, next) => {
    const errorArray = [];
    const { fullName, email, password } = req.body;
    const isName = validator.isLength(fullName, { min: 1, max: 64 })
    if (!isName) {
        errorArray.push("Fullname should between 1 to 64");
    }
    const isEmail = validator.isEmail(email)
    if (!isEmail) {
        errorArray.push("Email is not Valid")
    }
    const isPswrd = validator.isStrongPassword(password)
    if (!isPswrd) {
        errorArray.push("Password must be of length 8 and contain one Uppercase, one Lowercase, one special character and one numeric value")
    }
    const isPswrdLength = validator.isLength(password, { max: 32 })
    if (!isPswrdLength) {
        errorArray.push("Password length should be between 8 to 32 characters");
    }
    if (errorArray.length != 0) {
        return res.render("register", { errorArray, errorMessage: "", successMessage: "" })
    }
    next();
}
