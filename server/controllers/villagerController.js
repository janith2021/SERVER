const generateUniqueId = require("generate-unique-id")
const user = require("../model/user")
const organizations = require("../model/users/organization")
const villager = require("../model/users/villager")
const bcrypt = require("bcryptjs")
const { smssender } = require("./mailer")

const villagerRegister = async(req,res) => {
    const {name,email,password,mobile,image} = req.body

    const existuser = await user.findOne({email})
    if(!existuser){
        const salt = await bcrypt.genSalt(10);
        const newpassword = bcrypt.hashSync(password,salt)
        const id = generateUniqueId({
            length : 4,
            useNumbers : true,
            useLetters : false
        })
        const _id = "villager_"+id

        const villagers = new villager({
            _id,
            name,
            email,
            mobile,
            image,
        })
        const users = new user({
            _id,
            email,
            password : newpassword,
            role : "Villager"
        })

        const villageruser  = villagers.save();
        const usercreation = users.save()
        if(villageruser && usercreation){
            // const smsresponse = await smssender(
            //   mobile,
            //   "Hi " +
            //     name.toUpperCase() +
            //     ",\\n" +
            //     "Your have Successfully Registered In our System as a Villager." +
            //     "\\n" +
            //     "Thank You." +
            //     "\\n" +
            //     "Fight The Bites Mobile Application Team"
            // );
            var smsresponse = 200;
            if(smsresponse === 200){
                res.json({ type: "success", message: "Registration Success" });
            }else{
                res.json({type: "error",message : "Registration Failed"})
            }
        }else{
            res.json({type : "error" , message : "Registraion Failed"})
        }
    }else{
        res.json({type : "error" , message : "Email Already Exists"})
    }
}

module.exports = villagerRegister