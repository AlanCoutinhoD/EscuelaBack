const express = require('express');
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/create', authMiddleware, StudentController.create);
router.get('/all', authMiddleware, StudentController.getAllStudents);
router.put('/update/:id', authMiddleware, StudentController.updateStudent);
router.delete('/delete/:id', authMiddleware, StudentController.deleteStudent);
router.get('/search', authMiddleware, StudentController.searchStudents);

module.exports = router;