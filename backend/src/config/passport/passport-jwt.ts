import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { env } from "../Env";
import { prisma } from "../prisma";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: payload.sub,
          },
        });
        if (!user) {
          return done(null, false);
        }

        const { password_hash, ...userWithoutPassword } = user;

        return done(null, userWithoutPassword);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);
