const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    rating:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    student:{
        type: Schema.Types.ObjectId,
        ref:'Student',
        required:true
    }
})

module.exports = mongoose.model('Feedback',feedbackSchema);