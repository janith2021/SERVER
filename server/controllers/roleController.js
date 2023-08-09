const organizations = require("../model/users/organization");
const villager = require("../model/users/villager")

const getroledeatils = async(role,email) => {
    if(role === "Villager"){
        const user = await villager.findOne({email})
        return user;
    }else if(role === "Organization"){
        const user = await organizations.findOne({email})
        return user;
    }
}

module.exports = getroledeatils