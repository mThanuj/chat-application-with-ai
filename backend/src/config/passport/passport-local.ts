import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return done(null, false);
      }

      const isValid = await bcrypt.compare(password, user.password_hash!);
      if (!isValid) {
        return done(null, false);
      }

      const { password_hash, ...userWithoutPassword } = user;

      return done(null, userWithoutPassword);
    }
  )
);
