const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const mongoose = require('mongoose');

const app=express();

//set up middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

// Book Meal

// End book meal

const messRoutes=require('./routes/mess.js');
const studentRoutes=require('./routes/student.js');
const adminRoutes=require('./routes/admin.js');

app.use(messRoutes);
app.use(adminRoutes);
app.use(studentRoutes);


//start server and connect to database

// mongoose.connect('mongodb+srv://adnan:messmaven@clustermessmaven.nlimeey.mongodb.net/messmaven?retryWrites=true&w=majority')
mongoose.connect('mongodb://127.0.0.1:27017/messmaven')
.then((result)=>{
    console.log("Connected to database");

    app.listen(3000,()=>{
        console.log("Server Started at Port:3000");
    })
})
.catch(err=>{
    console.log("Error in connecting to database");
})
