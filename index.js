require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require("path");

// jwt token
let opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; //TODO: should not be in code

//db connections
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

//middleware
server.use(express.static(path.resolve(__dirname, process.env.PUBLIC_DIR)));
server.use(cookieParser());

server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productsRouter.router); //we can also use JWT
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
// this line we add to make react router work in case of other routes doesnt match
server.get("*", (req, res) =>
  res.sendFile(path.resolve(process.env.PUBLIC_DIR, "index.html"))
);

//passport strategies

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    //by default password user username

    try {
      const user = await User.findOne({ email: email }).exec();
      // this is just temporary, we will use strong password auth

      if (!user) {
        done(null, false, { message: "no such user email" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          } else {
            const token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token }); // this line send to serialize user
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this call serialize
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, sanitizeUser(user));
  });
});
// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//payment
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

server.listen(process.env.PORT, () => {
  console.log("server started");
});
