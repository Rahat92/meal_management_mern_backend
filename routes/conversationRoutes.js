const express = require("express");
const {
  createConversation,
  getConversations,
} = require("../controllers/conversationController");
const { protect } = require("../controllers/userController");
const router = express.Router();

router.route("/").post(createConversation);
router.route("/:id").get(getConversations);

const conversationRouter = router;
module.exports = conversationRouter;
