const MessagesDao = require("../daos/messagesDao");
const fakerRandomProducts = require("../utils/mockData");

class MessagesController {
    constructor() {
        this.messagesDao = new MessagesDao();
    }

    getMessages = async (req, res) => {
        const messages = await this.messagesDao.getMessages();
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
}

module.exports = MessagesController;
