
const path=require('path');
const Student = require('../model/student');
const Admin = require('../model/admin');

// const p=path.join(process.mainModule)

exports.getSignup=(req,res)=>{
    res.render('signup');
}

exports.postSignup=(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;

    const newStudent = new Student({
        name:name,
        email:email,
        phone:phone,
        password:password,
        attendance:[0,0,0,0,0,0,0,0,0,0,0,0],
        amount:[0,0,0,0,0,0,0,0,0,0,0,0],
        paymentStatus:["-","-","-","-","-","-","-","-","-","-","-","-","-"]
    })

    newStudent.save();
    res.redirect("/");
}

exports.getIndex=(req,res)=>{
    res.render('index');
}

exports.getAdminLogin=(req,res)=>{
    res.render('adminLogin',{id:'647240a15569563a26452b21'});
}

exports.postComplaint=(req,res)=>{

    const comment=req.body.comment;
    Admin.findOne()
    .then(admin=>{
        
        const complaints=[...admin.complaints];
        complaints.push(comment);

        admin.complaints=[...complaints];
        admin.save();
        res.render("index");
    })
}

