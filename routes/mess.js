const express=require('express');
const path=require('path');

const messController=require('../controllers/mess');

const router=express.Router();

router.get("/signup",messController.getSignup);
router.post("/signup",messController.postSignup);

router.get("/admin",messController.getAdminLogin);


router.post("/complaint",messController.postComplaint);

router.get("/",messController.getIndex);

module.exports=router;