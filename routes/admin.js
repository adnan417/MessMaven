
const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.post("/:id/adminLogin",adminController.postAdminLogin);
router.get("/:id/admin",adminController.getAdmin);

router.post('/:id/admin/createMenu',adminController.postMenu);

router.post("/:id/admin/deleteStudent",adminController.deleteStudent);

module.exports = router;