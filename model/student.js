const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    studentId:{
        type:String
    },
    course:{
        type:String
    },
    year:{
        type:Number
    },
    hostel:{
        type:String
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String
    },
    amount:[{
        type:Number
    }],
    paymentStatus:[{
        type:"String"
    }],
    attendance:[{
        type:Number
    }],
})

module.exports = mongoose.model('Student',studentSchema);