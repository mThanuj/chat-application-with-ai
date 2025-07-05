import express from "express";
import passport from "passport";
import {
  askAI,
  getPreviousMessages,
  getSession,
} from "../controllers/ai.controller";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/get-session", getSession);
router.post("/ask-ai", askAI);
router.get("/get-previous-messages/:sessionId", getPreviousMessages);

export default router;
