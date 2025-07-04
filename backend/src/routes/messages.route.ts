import express from "express";
import passport from "passport";
import {
  previousMessages,
  sendMessage,
} from "../controllers/messages.controller";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/previous-messages/:id", previousMessages);
router.post("/send-message/:id", sendMessage);

export default router;
