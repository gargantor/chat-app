const mongoose = require('mongoose');
const User = mongoose.model("User");
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if(!emailRegex.test(email)) throw "Email is not supported from your domain";
    if(password.length < 3 ) throw "Password must be atleast 3 character long";

    const userExists = await User.findOne({
        email,
    });

    if(userExists) throw "user with same email already exist";

    const user = new User({ 
        name, 
        email, 
        password: sha256(password + process.env.SALT) 
    });

    await user.save();

    res.json({
        message: "User [" + name + "] registered succesfully!",
    })

}
exports.login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT)         
    });

    if(!user) throw "Email and passord did not match,";

    const token = await jwt.sign({id: user.id }, process.env.SECRET);

    res.json({
        message: "User logged in successfully!",
        token,
    })
}