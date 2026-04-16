const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const { parseInvoice } = require('../services/aiService');

const extractInvoiceData = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  console.log(`[Processing] User: ${userId}, File: ${req.file.originalname}`);

  try {
    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      extractedText = data.text;
      
      if (!extractedText || extractedText.trim().length < 5) {
        return res.status(400).json({ 
          error: 'This PDF appears to be a scanned image with no readable text. Please upload a clear photo of the invoice instead.' 
        });
      }
    } else {
      const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
      extractedText = text;
    }

    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(400).json({ error: 'Could not extract legible text from the document.' });
    }

    const aiData = await parseInvoice(extractedText);

    if (!aiData || !aiData.totalAmount) {
      return res.status(422).json({ error: 'AI couldn\'t find a clear total amount. Please ensure the invoice is well-lit and legible.' });
    }

    // Date Guard: Ensure we have a valid date for Prisma
    let transactionDate = new Date();
    if (aiData.date) {
      const parsedDate = new Date(aiData.date);
      if (!isNaN(parsedDate.getTime())) {
        transactionDate = parsedDate;
      }
    }

    const expense = await prisma.expense.create({
      data: {
        userId: userId,
        amount: Number(aiData.totalAmount),
        category: aiData.category || 'Shopping',
        date: transactionDate,
        description: aiData.merchantName ? `Place: ${aiData.merchantName}` : 'Automated Invoice Entry',
        currency: aiData.currency || 'INR',
      }
    });

    res.json({
      message: 'Expense added automatically',
      expense,
      extractedData: aiData
    });
  } catch (error) {
    console.error('Core Extraction Error:', error);
    res.status(500).json({ error: 'Internal server error during processing' });
  }
};

const uploadInvoice = (req, res) => extractInvoiceData(req, res);

module.exports = {
  uploadInvoice,
  extractInvoiceData
};
