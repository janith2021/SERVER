const express = require('express');
const { register, login, getUser, generateOTP, createResetSession, updateUser, resetpassword, verifyotp } = require('../controllers/appController');
const localvariable = require('../middlewares/auth');
const router = express.Router();

router.route('/register').post(register)
router.route('/registermailing').post()
router.route('/authenticate').post()
router.route('/login').post(login)

router.route('/user').post(getUser)
router.route('/sendotp').post(generateOTP)
router.route('/verifyotp').post(verifyotp)
router.route('/createResetSession').get(createResetSession)

router.route('updateuser').put(updateUser)
router.route('/resetpassword').post(resetpassword)

module.exports = router;