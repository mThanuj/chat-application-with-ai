import e from "express";
import express from "express";
import {
  googleLogin,
  login,
  logout,
  register,
  getMe,
} from "../controllers/auth.controller";
import passport from "passport";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "openid"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleLogin
);
router.get("/logout", logout);
router.post("/register", register);
router.get("/me", passport.authenticate("jwt", { session: false }), getMe);

export default router;
