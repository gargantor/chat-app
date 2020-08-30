const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatrommController = require('../controllers/chatrommController');

const auth = require("../middlewares/auth");

router.post("/", auth, catchErrors(chatrommController.createChatRoom));
router.get("/", auth, catchErrors(chatrommController.getAllChatrooms));

module.exports = router;