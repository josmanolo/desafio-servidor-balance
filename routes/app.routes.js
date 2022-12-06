const express = require("express");
const { Router } = express;
const { checkAuth, sendSms, sendMail } = require("../utils/helpers");
const MessagesController = require("../controllers/messages.controllers");

const appRouter = Router();
const Messages = new MessagesController();

appRouter.get("/api/chat-products", checkAuth,  async (req, res) => {
    try {
        Messages.getMessages(req, res);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e,
        });
        console.log(e);
    }
});

appRouter.get("/profile", checkAuth, (req, res) => {
    res.render("profile", { layout: "profile" });
});

appRouter.post("/order", checkAuth, (req, res) => {
    const { tel } = req.session.passport;
    sendMail("",req.session.passport)
    sendSms(tel);
});
module.exports = appRouter;