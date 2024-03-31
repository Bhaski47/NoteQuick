const mongoose = require('mongoose');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    pass:{type:String,required:true}
});

const validate = (data) =>{
    const passOption = {
        min:8,
        max:30
    };
    const schema = joi.object({
        name:joi.string().required().label("Name"),
        email:joi.string().email().required().label("Email"),
        pass:passwordComplexity(passOption).required().label("Password")
    })
    return schema.validate(data);
}

userSchema.methods.generateAuthToken=()=>{
    const tok = jwt.sign({_id:this.id},"adadq3we32e32dwefe3q1!@!",{expiresIn:'1d'});
    return tok;
}

const User = mongoose.model("users",userSchema);
module.exports = {User,validate};