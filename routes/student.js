
const express = require('express');
const studentController = require('../controllers/student');

const router = express.Router();

router.post("/login",studentController.postLogin);

router.get("/:id/editProfile",studentController.getEditProfile);
router.post("/:id/editProfile",studentController.updateProfile);

router.post('/:id/feedback',studentController.postFeedback);

router.post("/:id/book-meal",studentController.bookMeal);
router.post("/:id/verifyotp",studentController.verifyMeal);

router.get("/:id/payment",studentController.getPayment);
router.get("/:id/success",studentController.paymentSuccess);
router.get("/:id/failure",studentController.paymentFailure);


router.get("/:id/profile",studentController.getProfile);
router.get("/:id/dashboard",studentController.getDashboard);

module.exports = router;