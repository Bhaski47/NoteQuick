const router = require('express').Router();
const { deleteNotes } = require('../controllers/deleteNotes');
const { getNotes } = require('../controllers/getNotes');
const { insertNotes } = require('../controllers/insertNotes');
const { updateNotes } = require('../controllers/updateNotes');

router.post("/get", getNotes);
router.post("/insert",insertNotes);
router.put("/update/:id",updateNotes);
router.delete("/delete/:id",deleteNotes);

module.exports = router;
