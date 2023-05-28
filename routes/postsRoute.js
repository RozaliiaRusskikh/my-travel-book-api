const router = require("express").Router();
const postsController = require("../controllers/postsController");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

require("dotenv").config();
let { SECRET_ACCESS_KEY, ACCESS_KEY_ID } = process.env;

// aws.config.update({
//   secretAccessKey: SECRET_ACCESS_KEY,
//   accessKeyId: ACCESS_KEY_ID,
//   region: "us-west-1",
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     acl: "public-read",
//     bucket: "my-travel-memory-book",
//     key: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });

//** Static files storage **
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

router
  .route("/")
  .get(postsController.index)
  .post(upload.single("image"), postsController.addPost);

router
  .route("/:id")
  .get(postsController.singlePost)
  .put(upload.single("image"), postsController.updatePost)
  .delete(postsController.deletePost);

router
  .route("/:id/attractions")
  .get(postsController.postAttractions)
  .post(upload.single("image"), postsController.addAttraction);

router
  .route("/:postId/attractions/:attractionId")
  .get(postsController.singleAttraction)
  .put(upload.single("image"), postsController.updateAttraction)
  .delete(postsController.deleteAttraction);

module.exports = router;
