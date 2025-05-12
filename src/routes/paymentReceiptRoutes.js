const express = require('express');
const PaymentReceiptController = require('../controllers/paymentReceiptController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/create', authMiddleware, PaymentReceiptController.create);
router.get('/all', authMiddleware, PaymentReceiptController.getAllReceipts);
router.get('/:id', authMiddleware, PaymentReceiptController.getReceiptById);
router.get('/search', authMiddleware, PaymentReceiptController.searchReceipts);
router.delete('/delete/:id', authMiddleware, PaymentReceiptController.deleteReceipt);
router.get('/student/:studentId/year/:year', authMiddleware, PaymentReceiptController.getReceiptsByStudentAndYear);

module.exports = router;