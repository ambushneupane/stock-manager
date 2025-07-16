const User=require('../models/users');
const {BadRequestError, NotFoundError}=require('../errors')
exports.registerUser=async(req,res)=>{
    const {username,email,password}=req.body || {};
    if(!username || !email || !password){
        throw new BadRequestError('Please provide name,Email and pass');
    }
    const existing= await User.findOne({
        email
    });
    if(existing){
        throw new BadRequestError('Email already registered');
    }
    const user= await User.create({username,email,password});
    const token= user.generateJWT();
    res.status(201).json({
        msg:`User Registered Successfully`,
        token
    })
}

exports.loginUser= async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new BadRequestError("Please Provide Email and pass");
    }
    //Finding the user

    const user=await User.findOne({email});
    if(!user){
        throw new NotFoundError('Invalid Creds');
    }
    const isMatch= await user.comparePassword(password);
    if(!isMatch){
        throw new BadRequestError('Invalid Creds');
    }
    const token=user.generateJWT();
    res.status(200).json({
        msg:'Login Successful',
        token
    })

}