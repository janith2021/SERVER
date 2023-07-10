
const localvariable = (req,res,next) => {
    req.app.locals = {
        OTP : null,
        sessionReset : false 
    }
    next()
}

module.exports = localvariable;