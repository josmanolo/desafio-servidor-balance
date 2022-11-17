const express = require("express");
const { Router } = express;
const { checkAuth, sendSms, sendMail } = require("../utils/helpers");
const fakerRandomProducts = require("../utils/mockData");
const messagesContainer = require("../containers/containerMongo");

const appRouter = Router();
const Messages = new messagesContainer();

appRouter.get("/api/chat-products", checkAuth,  async (req, res) => {
    try {
        const getDBMessages = async () => {
            const messages = await Messages.getMessages();
            console.log(req.session.passport);
            res.render("index", {
                layout: "app",
                list: {
                    products: fakerRandomProducts(),
                    messages: messages,
                    user: req.session.passport.user,
                },
            });
        };
        getDBMessages();
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