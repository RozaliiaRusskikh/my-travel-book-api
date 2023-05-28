const router = require("express").Router();
const postsController = require("../controllers/postsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
