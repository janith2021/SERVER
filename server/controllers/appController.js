const user = require("../model/user");
const bcrypt = require("bcryptjs");
// const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const otpgenerate = require('otp-generator');
const OTP = require("../model/otp");
const { use } = require("../routes/route");
const otp = require("../model/otp");
const { mailgenerate, transport, smssender } = require("./mailer");
const { hashpassword } = require("./hashPassword");

const register = async (req, res) => {
  try {
    const { name, email, password, mobile, image } = req.body;
    const existuser = await user.findOne({ email });
    if (existuser) {
      res.json({ type: "error", message: "Email Already Exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newpassword = bcrypt.hashSync(password, salt);
      const users = await new user({
        name,
        email,
        password: newpassword,
        mobile,
        image,
      });
      const createduser = await users.save();
      if (createduser) {
        var emailing ={
          body : {
            name : name.toUpperCase(),
            greeting : 'Dear',
            signature : 'Yours Sincerely',
            intro : "You have Registered Successfully in our System",
            outro : "You can contact us anytime"
          } 
        }
        var bodyemail = mailgenerate.generate(emailing)
        let message = {
          from : 'onlinesite1998@gmail.com',
          to : email,
          subject : "Registration Successful",
          html : bodyemail
        }
        transport.sendMail(message).catch((err)=> console.log(err))
        res.json({
          type: "success",
          message: "You have Registered Successfully",
        });
      } else {
        res.json({
          type: "error",
          message: "Registration Failed. Try Again Later.",
        });
      }
    }
  } catch (error) {
    res.json({ type: "error", message: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailexistuser = await user.findOne({ email },);
    if (emailexistuser) {
      passwordverified = bcrypt.compareSync(password, emailexistuser.password);
      if (passwordverified) {
        // const token = jwt.sign({
        //     email,
        // }, process.env.JWT_TOKEN,{expiresIn : "2h"});
        console.log(emailexistuser.role)
        res.json({message : 'You have Logged In Successfully' , type : 'success', role : emailexistuser.role})
      }else{
        res.json({type : 'error' , message : 'Invalid Password'})
      }
    } else {
      res.json({ type: "error", message: "Invalid Email" });
    }
  } catch (error) {
    res.json({type : 'error' , message : error})
  }
};

const getUser = async (req, res) => {
  const{email} = req.body
  console.log(email)
  const existuser = await user.findOne({email});
  if(existuser){
    console.log(existuser);
    res.json({type : 'success' , user : existuser.role})
  }else{
    res.json({type : 'error' , message : 'No User Found'});
  }
};

const updateUser = async (req, res) => {
  res.json("Update User Route");
};

const generateOTP = async (req, res) => {
    try {
       const { email } = req.body;
       const existuser = await user.findOne({email})
    //    console.log(existuser);
       if(existuser){
        var generateotp =  otpgenerate.generate(4, {
          digits: true,
          lowerCaseAlphabets: false,
          specialChars: false,
          upperCaseAlphabets: false,

        });
        // var salt = await bcrypt.genSalt(10)
        // generateotp = bcrypt.hash(generateotp,5) 
        // generateotp = await hashpassword(generateotp);
        var generateotps = bcrypt.hashSync(generateotp)
        console.log(generateotps);
        const otps = await new OTP({
            otp : generateotps,
            email : existuser.email
        })
        await otps.save();
        const smsresponse = await smssender(
          existuser.mobile,
          "Dear " +
            existuser.name.toUpperCase() +
            ",\\n" +
            "Your OTP for Reset Password Process is " +
            "\\n" +
            generateotp +
            "\\n" +
            "This OTP is Only Valid for 15 minutes." +
            "\\n" +
            "\\n" +
            "Thank You." +
            "\\n" +
            "Fight The Bites Team"
        );
        // await smssender()
        console.log(smsresponse.status)
        if(smsresponse.status == 200){
          var emailing = {
            body: {
              name: existuser.name.toUpperCase(),
              greeting: "Dear",
              signature: "Yours Sincerely",
              intro: "Your Reset Passaword OTP is "+generateotp,
              outro: "You can contact us anytime",
            },
          };
          var bodyemail = mailgenerate.generate(emailing);
          let message = {
            from: "onlinesite1998@gmail.com",
            to: email,
            subject: "Reset Password",
            html: bodyemail,
          };
          transport.sendMail(message).catch((err) => console.log(err));
          res.json({type: 'success' , user : email, message : 'OTP SENT'})
        }else{
          res.json({type : 'error', message : smsresponse.data});
        }  
       }else{
        res.json({type : 'error' , message : 'Invalid Email'});
       } 
       
    } catch (error) {
        res.json({type : 'error' , message : error})
    }
};

const verifyotp = async (req,res) => {
     const {email,otp} = req.body;
     console.log(otp);
     const uservalidation = await OTP.find({email})
     console.log(email)
     if(uservalidation.length > 0){
        var uservalidations = await uservalidation[uservalidation.length - 1]
         console.log(uservalidations.otp);
        if(bcrypt.compareSync(otp,uservalidations.otp)){
           console.log(uservalidations);
            uservalidations.verified = true;
            uservalidations.save(); 
            console.log(uservalidation);
            res.json({type : 'success' , message : 'OTP Verified'})
        }else{
          console.log('hi');
          res.json({type : 'error' , message : 'Invalid OTP'})
        }
     }else{
      console.log("hello");
        res.json({type : 'error' , message : 'Invalid User'})
     }

}

const createResetSession = async (req, res) => {
  res.json("Create Reset Session Route");
};

const resetpassword = async (req, res) => {
  try {
    const {email,password} = req.body;
    let usercheck = await otp.find({email})
    console.log(usercheck)
    if(usercheck.length > 0){
      usercheck = usercheck[usercheck.length - 1];
      //  console.log(usercheck.verified);
      if(usercheck.verified){
        const updateuser = await user.findOne({email})
        // const salt = await bcrypt.genSalt(10)
        const hashedpassword = bcrypt.hashSync(password)
        updateuser.password = hashedpassword;
        const response = await updateuser.save();
         console.log(response);
        res.json({type : 'success' , message : 'Your Password Reset Successfully'})
      }else{
        res.json({type : 'error' , message : 'Unauthorized Access' , redirect : 'true'})
      }
    }else{
      res.json({type : 'error' , message : 'Session Expired. Please Try Again', redirect : 'true'})
    }
  } catch (error) {
     res.json({type : 'error' , message: error})
  }
};

module.exports = {
  register,
  getUser,
  updateUser,
  generateOTP,
  createResetSession,
  login,
  resetpassword,
  verifyotp
};
