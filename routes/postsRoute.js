const router = require("express").Router();
const postsController = require("../controllers/postsController");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

let { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router
  .route("/")
  .get(postsController.index)
  .post(uploadS3.single("image"), postsController.addPost);

router
  .route("/:id")
  .get(postsController.singlePost)
  .put(uploadS3.single("image"), postsController.updatePost)
  .delete(postsController.deletePost);

router
  .route("/:id/attractions")
  .get(postsController.postAttractions)
  .post(uploadS3.single("image"), postsController.addAttraction);

router
  .route("/:postId/attractions/:attractionId")
  .get(postsController.singleAttraction)
  .put(uploadS3.single("image"), postsController.updateAttraction)
  .delete(postsController.deleteAttraction);

module.exports = router;
