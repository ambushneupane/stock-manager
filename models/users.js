const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken');


const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        minlength:3,
        maxlength:16,
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/.+@.+\..+/,'Please Enter a valid Email']
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:[8,'Password Must be atleast 8 characters long']
    }
},{timestamps:true})

//Hashing the password before saving
userSchema.pre('save',async function(){

if(!this.isModified('password')) return; //prevents Rehasing if pass isn't changed
const salt= await bcrypt.genSalt(10);
this.password= await bcrypt.hash(this.password,salt) 
})

//Comparing Passwords

userSchema.methods.comparePassword= async function(inputPassword){
    const isMatch= await bcrypt.compare(inputPassword,this.password);
    return isMatch; 

}

userSchema.methods.generateJWT= function(){
    return jwt.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        {expiresIn:'5d'}
    )
}



module.exports= mongoose.model('User',userSchema)