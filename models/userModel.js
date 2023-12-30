const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        minlength: [4,'Name must be at least 4 characters']
    },
    role:{
        type: String,
        default: 'user'
    },
    email: {
        type:String, 
        unique: true,
    },
    photo: {
        type: String,
        default: 'default.png',
    },
    password: {
        type: String,
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator:function (el) {
                return el === this.password
            },
            message:'Password not matched!'
        }
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangeAt: Date
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now()-1000
})
userSchema.methods.isPasswordMatched = async function (candidatePass) {
    console.log('my pass: ', candidatePass, this);
    return await bcrypt.compare(candidatePass, this.password)
}

userSchema.methods.isPasswordChanged = function(jwtTimeStamp){
    if(this.passwordChangeAt){
        const passwordChangedAt = parseInt(this.passwordChangeAt/1000, 10)
        return passwordChangedAt > jwtTimeStamp
    }
    return false
}
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined
})
const User = mongoose.model('User', userSchema)
module.exports = User;