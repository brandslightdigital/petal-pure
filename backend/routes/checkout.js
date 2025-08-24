const router = require('express').Router();
const { saveDetails, listDrafts, getDraft } = require('../controllers/CheckoutController');
router.post('/details', saveDetails);
router.get('/drafts', listDrafts);
router.get('/drafts/:id', getDraft);
module.exports = router;
