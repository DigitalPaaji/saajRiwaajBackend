const express = require('express');
const { createPagesData, getPagesData, handleDelete, editData } = require('../controllers/pagesController');
const router = express.Router()

router.post("/create",createPagesData)
router.get("/get/:pageType",getPagesData)
router.post("/delete",handleDelete)
router.post("/update",editData)

module.exports = router;