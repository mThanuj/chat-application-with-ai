import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../Env";
import { prisma } from "../prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const payload = {
        email: profile.emails![0].value,
        firstName: profile.name!.givenName,
        lastName: profile.name!.familyName,
        googleId: profile.id,
        displayName: profile.displayName,
        avatarUrl: profile.photos![0].value,
      };

      const user = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (user) {
        return done(null, user);
      }

      const createdUser = await prisma.user.create({
        data: {
          email: payload.email,
          first_name: payload.firstName,
          last_name: payload.lastName,
          google_id: payload.googleId,
          display_name: payload.displayName,
          avatar_url: payload.avatarUrl,
        },
      });

      if (!createdUser) {
        return done(null, false);
      }

      const { password_hash, ...userWithoutPassword } = createdUser;

      return done(null, userWithoutPassword);
    }
  )
);
