const axios = require('axios')

const settime = async (req,res) => {
    const resulttime = await axios.get(process.env.DATETIMEURL);
    const datetime = resulttime.data.datetime;
    // console.log(datetime);
    return datetime;
} 

module.exports = {settime}