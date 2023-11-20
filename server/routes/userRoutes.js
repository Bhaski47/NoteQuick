const router = require('express').Router();
const {createController} = require('../controllers/signController');
const {logController} = require('../controllers/logController');

router.post("/create",createController)

router.post("/log",logController);

module.exports = router;