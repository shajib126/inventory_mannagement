const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Add Your name"]
    },
    email:{
        type:String,
        required:[true,"please add your email address"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        
    },
    photo:{
        type:String,
        default:"https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png"
    },
    phone:{
        type:String,
        default:"+880"
    },
    bio:{
        type:String,
        maxLength:[250,'Bion must not be more than 250 charecter']
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hashedPassword = await bcrypt.hash(this.password,10)
    this.password = hashedPassword
    next()
})
const User = mongoose.model('User',userSchema)
module.exports = User
