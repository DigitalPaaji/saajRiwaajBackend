const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const catupload = multer({ storage,
   limits: {
    fileSize: 1024 * 1024, 
  }, });

module.exports = catupload;






