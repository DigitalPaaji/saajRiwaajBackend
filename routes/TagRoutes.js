const express = require('express')
const router = express.Router()
const tagController = require('../controllers/TagController')

router.post('/', tagController.createTag);
router.get('/', tagController.getTags);
router.delete('/:id', tagController.deleteTag);

module.exports = router;