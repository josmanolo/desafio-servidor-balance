const express = require("express");
const { Router } = express;
const { checkAuth } = require("../utils/helpers");
const fakerRandomProducts = require("../utils/mockData");
const messagesContainer = require("../containers/containerMongo");

const appRouter = Router();
const Messages = new messagesContainer();

appRouter.get("/api/chat-products", checkAuth,  async (req, res) => {
    try {
        const getDBMessages = async () => {
            const messages = await Messages.getMessages();
            res.render("index", {
                layout: "app",
                list: {
                    products: fakerRandomProducts(),
                    messages: messages,
                    username: req.session.username,
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

module.exports = appRouter;