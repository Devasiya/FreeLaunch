// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");



const Client = require("./models/client");
const Freelancer = require("./models/freelancer");
const authRoutes = require("./routes/authRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");

// Connect to MongoDB
const dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/sureConnect";
mongoose.connect(dbUrl)
    .then(() => console.log("✅ Connected to DB"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// View Engine & Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session Store (MongoDB)
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600, // Ensures session isn't saved too frequently
});

store.on("error", err => console.log("❌ Mongo Session Store Error:", err));
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ✅ Corrected Date
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport Authentication (Custom Strategy)
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
        let user = await Client.findOne({ email }) || await Freelancer.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: "Invalid email or password!" });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// ✅ Serialize User (Only Store `user._id`)
passport.serializeUser((user, done) => {
    console.log("✅ Serializing User:", user);
    done(null, user._id.toString()); // ✅ Ensure it's stored as a string
});


// ✅ Deserialize User (Retrieve Full User Object)
passport.deserializeUser(async (id, done) => {
    console.log("🔹 Deserializing User ID:", id);
    try {
        let user = await Client.findById(id) || await Freelancer.findById(id);

        if (!user) {
            console.log("❌ User Not Found in DB");
            return done(null, false);
        }

        console.log("✅ Deserialized User:", user);
        done(null, user);
    } catch (err) {
        console.error("❌ Error in Deserialization:", err);
        done(err, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// Flash Messages & Global Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currUser = req.user || null;
    next();
});

// ✅ Register Routes BEFORE Error Handlers
app.get("/", (req, res) => {
    res.render("home", { currUser: req.user });
});

//ROUTES
app.use("/auth", authRoutes);
app.use("/api/clients", clientRoutes);

// Catch-All Route for 404 Errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Global Error Handler with Fallback
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode);
    try {
        res.render("error.ejs", { statusCode, message });
    } catch (e) {
        res.send(`<h1>${message}</h1>`); // Fallback if error.ejs is missing
    }
});

// Start Server
app.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
});
