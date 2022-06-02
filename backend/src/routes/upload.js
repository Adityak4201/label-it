const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

//upload Image File
const uploadImage = multer({
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(/\.(jpg)$/) &&
      !file.originalname.match(/\.(txt)$/)
    ) {
      return cb(new Error("Please upload an image and a text file"));
    }
    cb(undefined, true);
  },
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    ACL: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fullPath =
        "objimages/" + req.body.obj_assigned + "/" + file.originalname;
      cb(null, fullPath);
    },
  }),
});

const cpUpload = uploadImage.fields([
  { name: "image", maxCount: 1 },
  { name: "text", maxCount: 1 },
]);

router.post("/object", cpUpload, authController.uploadImage);

module.exports = router;
