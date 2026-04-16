const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadInvoice, extractInvoiceData } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs and images are allowed'), false);
    }
  }
});

router.post('/upload', protect, upload.single('invoice'), uploadInvoice);
router.post('/extract', protect, upload.single('invoice'), extractInvoiceData);

module.exports = router;
