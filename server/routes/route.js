const express = require('express');
const { register, login, getUser, generateOTP, createResetSession, updateUser, resetpassword, verifyotp, mapdetails, mapinsert, setcarousel, getcarousel } = require('../controllers/appController');
const localvariable = require('../middlewares/auth');
const authenticateuser = require('../middlewares/auth');
const { createcampaign, registerorganization, getorganization, getAllCampaigns } = require('../controllers/organizationController');
const villagerRegister = require('../controllers/villagerController');
const router = express.Router();


//villager
router.route('/register').post(register)
router.route('/registermailing').post()
router.route('/authenticate').post()
router.route('/login').post(login)

router.route('/user').post(getUser)
router.route('/sendotp').post(generateOTP)
router.route('/verifyotp').post(authenticateuser,verifyotp)
router.route('/createResetSession').get(createResetSession)
router.route('/mapdetails').get(mapdetails).post(mapinsert)
router.route('/carousel').get(getcarousel).post(setcarousel)
router.route('/campaign').post(createcampaign)

router.route('updateuser').put(updateUser)
router.route('/resetpassword').post(authenticateuser,resetpassword)

//organization

router.route("/organization/register").post(registerorganization)
router.route("/organization/view").post(getorganization)
router.route("/organization/campaign/create").post(createcampaign)
router.route("/organization/getallcampaigns").post(getAllCampaigns)

//villager
router.route("/villager/register").post(villagerRegister)
module.exports = router;