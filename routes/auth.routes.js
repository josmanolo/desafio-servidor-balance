const express = require("express");
const { Router } = express;
const passport = require("passport");

const authRouter = Router();

authRouter.get("/login", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log("User is already logged");
            res.render("index", { layout: "login" });
        } else {
            console.log("User can login");
            res.render("index", { layout: "login" });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});

authRouter.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/api/chat-products",
        failureRedirect: "/login-error",
    }),
    (req, res) => {
        console.log("Login Post: ", res)
    }
);

authRouter.get(
    "/logout",
    (req, res) => {
        try {
            req.logout((err) => {
                if (err) return next(err);
                res.redirect("/login");
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
            });
        }
    }
);

authRouter.get("/signup", (req, res) => {
    res.render("index", { layout: "signup" });
});

authRouter.post("/signup", passport.authenticate("signup", {
    successRedirect: "/login",
    failureRedirect: "/signup-error",
}), (req, res) => {
    console.log("yes")
})

authRouter.get("/login-error", (req, res) => {
    res.render("index", { layout: "login-error" });
})

authRouter.get("/signup-error", (req, res) => {
    res.render("index", { layout: "signup-error" });
})

module.exports = authRouter;
