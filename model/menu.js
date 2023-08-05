const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    date:{
        type:String,
        required:true
    },
    breakfast:[{type:String,required:true}],
    lunch:[{type:String,requiredt:true}],
    dinner:[{type:String,requiredt:true}],
})

module.exports = mongoose.model('Menu',menuSchema);