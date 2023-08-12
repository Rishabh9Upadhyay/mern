const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invaid');
            }
        }
    },
    gender : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true 
    },
    confirmPassword : {
        type : String,
        required : true
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})


// using methods mean we r workinh with instance
// generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        // const token = jwt.sign({_id:this._id.toSting()},"RishabhRishabhRishabhRishabhRishabh");
        // const token1 = jwt.sign({_id:this._id},"RishabhRishabhRishabhRishabhRishabh");
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({token:token1})
        this.tokens = this.tokens.concat({token:token})       //according to object destructring
        // this.tokens = this.tokens.concat({token})       //according to object destructring
        await this.save();
        console.log(token);
        return token; 
    }catch(error){
        res.send("The error part is/are: "+error);
        console.log();("The error part is/are: "+error);
    }
}




employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(this.password,10);
        console.log(`Current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`Current password is ${this.password}`);

        this.confirmPassword = await bcrypt.hash(this.password,10);

    }
    // this.password = bcrypt.hash(this.password,10);
    next();
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;