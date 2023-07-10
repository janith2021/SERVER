const bcrypt = require('bcryptjs');


const hashpassword = (password) => {
    const salt = 10;
    password = bcrypt.hashSync(password);
    return password;
}

const comparepassword = async (password , hashedpassword) => {
    const verified = bcrypt.compareSync(password,hashedpassword);
    return verified;

}

module.exports = {hashpassword,comparepassword}