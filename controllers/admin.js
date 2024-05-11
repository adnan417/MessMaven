
const Admin = require('../model/admin');
const Feedback = require('../model/feedback');
const Menu = require('../model/menu');
const Student = require('../model/student');
const calculateDue = require('../utils/calculateDue');

exports.postAdminLogin = (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    if (user === 'admin' && password === 'admin') {
        res.redirect('/663f2295125c9e886947e1d3/admin')
    }
    else{
        res.send(`<h1>Incorrect credentials for admin</h1><button><a href="/">Back to Home</a></button>`);
    }
}

exports.getAdmin = (req,res)=>{

    Admin.findOne()
    .then(admin => {
        console.log(admin);
        const complaints = [...admin.complaints];
        return [];
    })
    .then(complaints => {

        Feedback.find()
            .then(feedbacks => {

                const temp = {
                    complaints: complaints,
                    feedbacks: feedbacks
                };

                return temp;
            })
            .then(temp => {

                Student.find()
                    .then(students => {

                        const complaints = temp.complaints;
                        const feedbacks = temp.feedbacks;

                        var stArray = [];
                        for (let i = 0; i < students.length; i++) {
                            const st = {
                                id:students[i]._id,
                                name: students[i].name,
                                course: students[i].course,
                                hostel: students[i].hostel,
                                payment: calculateDue(students[i].paymentStatus, students[i].charges)
                            }
                            stArray.push(st);
                        }

                        res.render('admin/adminPanel', {
                            id: '647240a15569563a26452b21',
                            complaints: complaints,
                            feedbacks: feedbacks,
                            students:stArray
                        });
                    })
                    .catch(err => {
                        console.log('Error in fetchng students');
                    })



            })
            .catch(err => {
                console.log("Error in fetching feedbacks");
            })

    })
    .catch(err => {
        console.log(err);
        console.log("Error in fetching complaints.")
    })

}

exports.postMenu = (req, res) => {

    //date
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    const menuDate = today.toLocaleDateString("en-US", options);

    const breakfast = [];
    breakfast.push(req.body.breakfastMc);
    breakfast.push(req.body.breakfastDe);
    breakfast.push(req.body.breakfastDr);

    const lunch = [];
    lunch.push(req.body.lunchMc);
    lunch.push(req.body.lunchDe);
    lunch.push(req.body.lunchDr);

    const dinner = [];
    dinner.push(req.body.dinnerMc);
    dinner.push(req.body.dinnerDe);
    dinner.push(req.body.dinnerDr);

    const menu = new Menu({
        date: menuDate,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner
    })

    menu.save();
    res.redirect('/647240a15569563a26452b21/admin')
}

exports.deleteStudent = (req,res)=>{

    const id=req.body.studentId;
    console.log(id);

    Student.findByIdAndDelete(id)
    .then(result=>{
        res.redirect('/647240a15569563a26452b21/admin');
    })
    .catch(err=>{
        console.log('Error in deleting');
    })
}
