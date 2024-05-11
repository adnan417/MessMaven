const calculateAmount = require('../utils/calculateAmount');
const calculateDue = require('../utils/calculateDue');
const calculateAttendance = require('../utils/calculateAttendance');
const Student = require('../model/student');
const Feedback = require('../model/feedback');
const Menu = require('../model/menu');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const otpGenerator = require('otp-generator');
const NodeCache = require('node-cache');
const stripe = require('stripe')('sk_test_51N9l76SBDO7qW5HLgA6gZIL0SayKTQJ5I10c2bXp4F7aVwmK9rJUr6V33kJbHRigYY71xwEcrHm1sXIqNPJqiy6u00qS5fR4E3');

exports.postLogin = (req, res) => {

    const emailEntered = req.body.email;
    const passwordEntered = req.body.password;

    Student.findOne({ email: emailEntered, password: passwordEntered })
        .then(student => {
            const id = student._id;
            res.redirect('/' + id + '/dashboard');
        })
        .catch(err => {
            res.write("Invalid username or password");
            res.send();
            console.log("User not found");
        })
}

exports.getDashboard = (req, res) => {

    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    const todayDate = today.toLocaleDateString("en-US", options);


    Menu.find({ date: todayDate })
        .then(menus => {

            var todayMenu = {
                breakfast: [],
                lunch: [],
                dinner: []
            }

            todayMenu.breakfast = [...menus[0].breakfast];
            todayMenu.lunch = [...menus[0].lunch];
            todayMenu.dinner = [...menus[0].dinner];

            return todayMenu;
        })
        .then(todayMenu => {

            const studentId = req.params.id;
            Student.findById(studentId)
                .then(student => {

                    const attendance = calculateAttendance([...student.attendance], [...student.paymentStatus])

                    const menu = {
                        breakfast: [...todayMenu.breakfast],
                        lunch: [...todayMenu.lunch],
                        dinner: [...todayMenu.dinner]
                    };

                    // console.log(menu);

                    res.render('dashboard', {
                        id: student._id,
                        name: student.name,
                        attendance: attendance,
                        email: student.email,
                        menu: menu
                    });
                })
                .catch(err => {
                    console.log("Error in finding the user in dashboard");
                })

        })
        .catch(err => {
            console.log('No menu found for today');
        })

}

exports.postFeedback = (req, res) => {

    const rating = req.body.rating;
    const comment = req.body.comment;

    const feedback = new Feedback({
        rating: rating,
        comment: comment,
        student: req.params.id
    })

    feedback.save()
    res.redirect('/' + req.params.id + '/dashboard');
}

exports.getProfile = (req, res) => {

    Student.findById(req.params.id)
        .then(student => {

            const perMonthCharges = calculateAmount([...student.attendance]);
            const dueAmount = calculateDue([...student.paymentStatus], perMonthCharges);

            res.render('profile', {
                id: student._id,
                email: student.email,
                password: student.password,
                name: student.name,
                studentId: student.studentId,
                course: student.course,
                year: student.year,
                hostel: student.hostel,
                phone: student.phone,
                address: student.address,
                dueAmount: dueAmount,
                perMonthAttendance: [...student.attendance],
                perMonthCharges: perMonthCharges,
                perMonthStatus: [...student.paymentStatus],
            });
        })
        .catch(err => {
            console.log("Error in finding the user  profile");
        })
}

exports.getEditProfile = (req, res) => {
    res.render('edit', { id: req.params.id });
}

exports.updateProfile = (req, res) => {

    Student.findById(req.params.id)
        .then(student => {
            student.studentId = req.body.studentId;
            student.phone = req.body.phone;
            student.address = req.body.address;
            student.hostel = req.body.hostel;
            student.course = req.body.course;
            student.year = req.body.year;

            student.save();
            res.redirect("/" + req.params.id + "/profile");
        })
        .catch(err => {
            console.log("Error in updating details");
        })

}

//book meal
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: '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'
//     }
// }));

var otpCache;

exports.bookMeal = (req, res) => {
    otpCache = new NodeCache({ stdTTL: 300 });
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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')

    Student.findById(req.params.id)
        .then(student => {

            const email = student.email;
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            otpCache.set(email, otp);

            const msg = {
                to: email, // Change to your recipient
                from: 'adnanmirza417@gmail.com', // Change to your verified sender
                subject: 'MessMaven Meal Book request',
                text: `Your One Time Password for meal booking is: ${otp} and thank you for using Mess Maven`,
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            }

            sgMail
                .send(msg)
                .then(() => {
                    console.log(msg);
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })

            // transporter.sendMail({
            //     to: email,
            //     from: 'adnanmirza417@gmail.com',
            //     subject: 'OTP for meal booking',
            //     text: `Your One Time Password for meal booking is: ${otp} and thank you for using Mess Maven`
            // });
        })
        .catch(err => {
            console.log('Unregistered student');
        })

}

exports.verifyMeal = (req, res) => {

    Student.findById(req.params.id)
        .then(student => {

            // Retrieve the stored OTP from the cache
            const cachedOTP = otpCache.get(student.email);

            if (!cachedOTP || cachedOTP !== req.body.otp) {
                res.render('invalidOtp', { id: student._id });
            }
            else {

                // mark atendance
                const today = new Date();
                const month = today.getMonth();

                student.attendance[month]++;
                student.save();

                res.render('validOtp', { id: student._id });
            }

            // Clear the OTP from the cache after successful verification
            otpCache.del(email);
        })
        .catch(err => {
            console.log('Error in verifying');
        })

}


//Payment
exports.getPayment = (req, res, next) => {

    Student.findById(req.params.id)
        .then(student => {

            const perMonthCharges = calculateAmount([...student.attendance]);
            // const dueAmount = calculateDue([...student.paymentStatus], perMonthCharges);
            const dueAmount = 100;

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: student.name,
                            },
                            unit_amount: dueAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: req.protocol + '://' + req.get('host') + '/' + req.params.id + '/success', // => http://localhost:3000
                cancel_url: req.protocol + '://' + req.get('host') + '/' + req.params.id + '/failure'
            });
        })
        .then(session => {
            res.render('payment', {
                sessionId: session.id,
                amount: session.amount_total / 100,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

// 4242424242424242

exports.paymentSuccess = (req, res) => {

    Student.findById(req.params.id)
        .then(student => {

            //updating status
            const paymentStatus = [...student.paymentStatus];
            for (let i = 0; i < 12; i++) {
                if (paymentStatus[i] === 'No')
                    paymentStatus[i] = 'Yes';
            }
            student.paymentStatus = [...paymentStatus];
            student.save();
            res.render("paymentSuccess", { id: student._id });
        })
        .catch(err => {
            console.log("Error in updating after clearing dues");
        })

}

exports.paymentFailure = (req, res) => {
    res.render("paymentFailure", { id: student._id });
}

