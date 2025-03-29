const express = require('express');
const { getAllAds, getAdById, myAds, newAd, adCount, updateAd, deleteAd } = require('../controllers/adsController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/ads', getAllAds);
router.get('/ads/:id', getAdById);
router.get('/my-ads', myAds);
router.put('/my-ads', updateAd);
router.post('/my-ads', deleteAd);
router.get('/ad-count', adCount);
router.post('/new-ad', upload.single('Bild'), newAd);

module.exports = router;