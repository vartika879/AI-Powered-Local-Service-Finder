const express = require('express');
const router = express.Router();
const { searchServices, getHistory, clearHistory } = require('../controllers/searchController');

router.get('/search', searchServices);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

module.exports = router;