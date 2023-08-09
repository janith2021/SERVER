const generateUniqueId = require("generate-unique-id")
const campaigns = require("../model/campaigns/campaign")
const organizations = require("../model/users/organization")
// const user = require("../model/user")
const { settime } = require("./timecontroller")
const user = require("../model/user")
const bcrypt = require('bcryptjs')


const registerorganization = async(req,res) => {
    const{name,email,mobile,image,division,members,role,password} = req.body
    //  console.log(req.body.email)
    try {
      const existuser = await user.findOne({email})
      if(!existuser){
      const salt = await bcrypt.genSalt(10)
      const newpassword = bcrypt.hashSync(password,salt)
      console.log(newpassword)
      console.log(newpassword);
       const id = await generateUniqueId({
         length: 4,
         useLetters: false,
         useNumbers: true,
       });
      //  console.log(email)
      //  console.log(_id)
      _id = role+"_"+id
       const createdAt = await settime()
       console.log(createdAt)
       const users = new user({
        _id,
        email,
        password : newpassword,
        role,
        createdAt,
        updatedAt : createdAt,
       });
       const org = new organizations({
         _id,
         name,
         email,
         mobile,
         image,
         division,
         members,
         createdAt,
         updatedAt : createdAt,
       });
       await org.save();
       await users.save()
      //  console.log(organizaionresponse)
       res.status(201).json({
         type: "success",
         message: "Organization Created Successfully",
       });
      }else{
        res.status(404).json({type : "error" , message : "Email Already Exists"})
      }
    } catch (error) {
        res.json({type : "error" , message : error})
    }
    
}


const createcampaign = async (req,res) => {
    const{name,date,location,report,sponsorshipamount,organizationid,campaigntime} = req.body

    // try {
        const time = await settime()
        // console.log(time)
        // generateUniqueId({

        // });
        const details = await organizations.findOne({_id : organizationid})
        // console.log(details.division)
        if(details){
        if(!details.division){
          res.status(404).json({type : "error" , message : "We cannot see any Associated Division With Your Organization"})
        }
        else{
        const id = await generateUniqueId({
          length: 4,
          useLetters: false,
          useNumbers: true,

        });
        const campid = "Camp_"+id;
        const camp = new campaigns({
          _id : campid,
          name: name,
          date: date,
          time : campaigntime,
          location: location,
          organizationid: organizationid,
          createdAt: time,
          updatedAt: time,
          division: details.division
        });

        const campaign = await camp.save();
        if(campaign){
            // console.log(campaign)
            res.status(201).json({type : "success" , message : "Campaign Created Successfully!"})
        }else{
            res.status(404).json({type: "success", message : "There is an Error while creating the campaign.Please Try Again Later"})
        }
      }
    }else{
      res.status(404).json({type : "error" , message : "Campaign Not Found"})
    }
    // } catch (error) {
    //     res.json({type : "error" , message : error})
    // }

}

const getorganization = async(req,res) => {
  const {email} = req.body
  const existuser = await organizations.findOne({email})
  if(existuser){
    res.status(200).json({user : existuser})
  }else{
    res.status(404).json({type : "error" , message : "No User Found"})
  }

}

const getAllCampaigns = async(req,res) => {
  const{division} = req.body
  const existcampaigns = await campaigns.find({division})
  if(existcampaigns){
    res.status(200).json({type : "success" , message : existcampaigns})
  }
  else{
    res.status(404).json({type : "error" , message : "No Campaign Found"})
  }
}


module.exports = {createcampaign,registerorganization,getorganization,getAllCampaigns}