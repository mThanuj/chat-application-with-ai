import express from "express";
import passport from "passport";
import { askAI, getSession } from "../controllers/ai.controller";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/get-session", getSession);
router.post("/ask-ai", askAI);

export default router;
