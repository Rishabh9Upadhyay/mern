require("dotenv").config();     //at top must

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
require("./db/conn");
const path = require("path"); 
const hbs = require('hbs');
const Register = require("./models/registers");
const { error, log } = require("console");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

// const staticPath = path.join(__dirname,"../public"); 
// app.use(express.static(staticPath));

const templates_path = path.join(__dirname,"../templates/views"); 
const partials_path = path.join(__dirname,"../templates/partials"); 


app.use(express.json());
app.use(express.urlencoded({extended : false}));


app.set("view engine","hbs");
app.set("views",templates_path); 
hbs.registerPartials(partials_path);




// console.log(process.env.SECRET_KEY)


app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/register',(req,res)=>{
    res.render("register")
})

// create a new user in our database
app.post('/register',async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : req.body.password,
                confirmPassword : cpassword
            })

            // Password Hash JWT
            // this is called concept of middleware(works b/w)

            console.log("The success part:"+registerEmployee);
            
            const token = await registerEmployee.generateAuthToken();
            console.log("The success part:"+token);
            
            
            const registered = await registerEmployee.save();
            console.log("The page part:"+registered);
            console.log(registered);
            res.status(201).render("index");
        }else{
            res.send("password not matching");
        }
    }catch(e){
        res.status(400).send(e);
        console.log("The error part is")
    }
})

app.get('/login',(req,res)=>{
    res.render("login")
})

// Login check
app.post('/login',async (req,res)=>{
    try{
        const email = req.body.email;  
        const password = req.body.password;
        console.log(`${email} and password is ${password}`);

        // Register.findOne({email:email})  But object destructuring allowus to to doud as 👇 if both name is same
        const useremil = await Register.findOne({email});
        // res.send(useremil.firstname);


        // Now bcrypting
        const isMatch = await bcrypt.compare(password, useremil.password)

        const token = await useremil.generateAuthToken();
        console.log("The success part: "+token);

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid Email or password");
        }
    }catch(e){
        res.status(400).send("Invalid Email or Password");
    }
})

app.get('/about',(req,res)=>{
    res.render("about")
})

app.get('/link',(req,res)=>{
    res.render("link")
})

app.get('*',(req,res)=>{
    res.render("404")
})







// const securePassword = async (password)=>{
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordHash1 = await bcrypt.compare(password,passwordHash);
//     console.log(passwordHash1);
// }
// securePassword("Rishabh");


// JWT
// const jwt = require('jsonwebtoken');

// const createtoken = async ()=>{
//     const token  = await jwt.sign({_id:"64d1d4390baf80ed02e0613b"},"secretkeyalalaskufbcurbckdmstrdkndk",{
//         expiresIn : "2 minutes"
//     });
    
//     console.log(token);

//     const userVer = await jwt.verify(token,"secretkeyalalaskufbcurbckdmstrdkndk");      //will check user authentication
//     console.log(userVer)
// }

// createtoken();



app.listen(port,()=>{
    console.log(`Listning at port number ${port}`);
})