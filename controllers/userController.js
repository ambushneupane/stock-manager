const User=require('../models/users');
const asyncWrapper=require('../middleware/asyncHandler.js')
const {BadRequestError, NotFoundError}=require('../errors')
const crypto = require('crypto');
const sendEmail= require('../utils/emailHandler.js')

exports.registerUser=asyncWrapper(async(req,res)=>{
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
})

exports.loginUser=asyncWrapper( async (req,res)=>{
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

})

exports.forgotPassword=asyncWrapper(async(req,res)=>{
    const {email}= req.body;
    if(!email) throw new BadRequestError('Please Proivde an Email');
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new BadRequestError('Please Provide a valid Email Address')
    }

    const user= await User.findOne({email});
    if (!user) {
        return res.status(200).json({
          message: 'If a user with this email exists, a password reset link has been sent.',
        });
      }
    const resetToken= user.createResetToken();
    await user.save({validateBeforeSave:false});
    
    const resetURL= `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`
    const message=`We have received a password reset request. Please use below link to reset your password \n\n${resetURL}\n\n This reset link will be valid for only 10 minutes`
    try {
        await sendEmail({
        email:user.email,
        subject:'Password Change Request Received',
        message:message
    });
    res.status(200).json({
        status:'Success',
        message:'Password Reset link has been sent to User\'s Email'
    })
}catch(err){
    //If reset email fails, clear the reset token and expiry from DB
    user.passwordResetToken=undefined,
    user.passwordResetExpires=undefined,
    user.save({validateBeforeSave:false})
    throw new BadRequestError('There was an error sending the email. Try again later.');
}
   
    // console.log(resetURL);
})


exports.resetPassword=asyncWrapper(async(req,res)=>{
    const { token } =req.params;
    const { password }=req.body;
    
    if(!password) throw new BadRequestError('Please Provide a new Password');
    const hashedToken= crypto.createHash('sha256').update(token).digest('hex')
    // console.log({token,hashedToken})
    const user= await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires:{ $gt:Date.now()}
    });

    if(!user) throw new NotFoundError('Token Is Invalid or Has expired');
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.status(200).json({msg:`Password has been reset successfully`})
    
}


)




