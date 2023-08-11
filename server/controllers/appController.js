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
const Map = require("../model/dengueaffected");
const slides = require("../model/carousel");
const organizations = require("../model/users/organization");
// const jwt = require('jsonwebtoken');
// const unique = require('generate-unique-id');
const generateUniqueId = require("generate-unique-id");
const { settime } = require("./timecontroller");
const villager = require("../model/users/villager");
const getroledeatils = require("./roleController");
const axios = require('axios')

const register = async (req, res) => {
  try {
    // console.log('hello')
    const { name, email, password, mobile, image , role} = req.body;
    // console.log(req.body)
    // console.log(req.body)
    const existuser = await user.findOne({ email });
    if (existuser) {
      res.json({ type: "error", message: "Email Already Exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newpassword = bcrypt.hashSync(password, salt);
      var _id = await generateUniqueId({
        useLetters : false,
        useNumbers : true,
        length : 4,
      })
      console.log('hello')
      _id = role+"_"+_id;
      console.log(_id)
      console.log(_id)
      const createdAt = await settime()
      // console.log(createdAt)
      // console.log(createduser)
      // console.log(createdAt) 
      const users = new user({
        _id: _id,
        password: newpassword,
        role,
        createdAt,
        updatedAt: createdAt,
      });
      const villagers = new villager({
        _id,
        name,
        email,
        image,
        mobile,
        createdAt,
        updatedAt : createdAt,
      });
      // console.log;
      const createduser = await users.save();
      const createdvillager = await villagers.save();
      console.log(createduser);
      console.log(createdvillager);
      if (createduser && createdvillager) {
        // console.log(createduser)
        // console.log
        var emailing ={
          body : {
            name : name.toUpperCase(),
            greeting : 'Dear',
            signature : 'Yours Sincerely',
            intro : "You have Registered Successfully in our System",
            outro : "You can contact us anytime",
          } 
        }
        var bodyemail = mailgenerate.generate(emailing)
        let message = {
          from : 'onlinesite1998@gmail.com',
          to : email,
          subject : "Registration Successul",
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
  const existuser = await user.findOne({email},"-password");
  if(existuser){
    console.log(existuser);
    res.json({type : 'success' , user : existuser})
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
       console.log(email)
       const existuser = await user.findOne({email})
       console.log(existuser);
       if(existuser){
        console.log("User Exist");
        const token = jwt.sign({ email : email}, process.env.JWTSECRET,{expiresIn : "15m"});
        console.log(token);
        console.log(token)
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
        const role = existuser.role;
        console.log(role)
        const userdetails = await getroledeatils(role,existuser.email);
        console.log(userdetails);
        const otps = await new OTP({
            otp : generateotps,
            email : existuser.email,
            token : token,
        })
        await otps.save();
          
        const smsresponse = await smssender(userdetails.mobile,
        "Dear " +
          userdetails.name.toUpperCase() +
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

        // console.log(smsresponse)
        await smssender()
        console.log(smsresponse.status.data.status)
        // var smsresponses.status = 200;
        if(smsresponse.status == 'success'){
          console.log("hello");
          console.log(userdetails.name);
          var emailing = {
            body: {
              name: userdetails.name.toUpperCase(),
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
          console.log('hello')
          res.json({type: 'success' , user : email, message : 'OTP SENT',token : token})
        }else{
          console.log('error');
          res.json({type : 'error', message : smsresponse.data});
        }  
       }else{
        console.log("User ")
        res.json({type : 'error' , message : 'Invalid Email'});
       } 
       
    } catch (error) {
        res.json({type : 'error' , message : error})
    }
};

const verifyotp = async (req,res) => {
     const {email,otp} = req.body;
    // console.log(req.email.email)
     if(req.email.email === email){
      const uservalidation = await OTP.find({email})
      // console.log(email)
      if(uservalidation.length > 0){
          var uservalidations = await uservalidation[uservalidation.length - 1]
          console.log(uservalidations.otp);
          if(bcrypt.compareSync(otp,uservalidations.otp)){
            //  console.log(uservalidations);
              uservalidations.verified = true;
              // console.log(uservalidations.token);
              // console.log(req.headers.authorization.split(" ")[1]);
              // const token = req.headers.authorization.split(" ")[1];
              // console.log(token === uservalidations.token)
              uservalidations.save(); 
              // console.log(uservalidation);
              res.json({type : 'success' , message : 'OTP Verified'})
          }else{
            // console.log('hi');
            res.json({type : 'error' , message : 'Invalid OTP'})
          }
      }else{
        // console.log("hello");
          res.json({type : 'error' , message : 'Invalid User'})
      }
     } else{
      res.json({type : 'error' , message : 'Invalid User'})
     }

}

const createResetSession = async (req, res) => {
  res.json("Create Reset Session Route");
};

const resetpassword = async (req, res) => {
  try {
    const {email,password} = req.body;
    if(email === req.email.email){
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
        usercheck.verified = false;
        usercheck.save();
        res.json({type : 'success' , message : 'Your Password Reset Successfully'})
      }else{
        res.json({type : 'error' , message : 'Unauthorized Access' , redirect : 'true'})
      }
    }else{
      res.json({type : 'error' , message : 'Session Expired. Please Try Again', redirect : 'true'})
    }
  }else{
      res.json({type : 'error' , message : 'Invalid User'})
  }
  } catch (error) {
     res.json({type : 'error' , message: error})
  }
};

const mapinsert = async(req,res) => {
  const {_id,area,count} = req.body

  const affectivity = new Map({
    _id,
    area,
    count
  })
  const saved = await affectivity.save()
  res.json({saved})
}

const mapdetails = async (req,res) => {
  const affetivity = await Map.find()
  console.log(affetivity); 
  res.json(affetivity)

}

const setcarousel = async (req,res) => {
  const {image,caption,status} = req.body
  try {
    const images = new slides({
      image : image,
      caption : caption,
      status : status
    })
    const response = await images.save()
    if(response){
      res.json({ type: "Success", message: "Image Saved Successfully" }); 
    }
    
  } catch (error) {
    res.json(error)
  }
}


const getcarousel = async (req,res) => {

  try {
    const images = await slides.find();
    if(images){
      res.json({type : "success" , image : images})
    }
  } catch (error) {
    res.json(error);
  }
  


}

module.exports = {
  register,
  getUser,
  updateUser,
  generateOTP,
  createResetSession,
  login,
  resetpassword,
  verifyotp,
  mapdetails,
  mapinsert,
  getcarousel,
  setcarousel,
};
