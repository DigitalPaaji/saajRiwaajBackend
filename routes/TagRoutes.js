const express = require('express')
const router = express.Router()
const tagController = require('../controllers/TagController');
const catupload = require('../helper/catimage');

router.post('/',  catupload.single("image") , tagController.createTag);
router.get('/', tagController.getTags);
router.delete('/:id', tagController.deleteTag);
router.put('/toggle/:id', tagController.ToggleStatus);
router.put('/:id',catupload.single("image") , tagController.editTag);
router.get("/getfrontend",tagController.getTagsToggle)

module.exports = router;
