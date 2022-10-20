const Messages = require("../models/messages.model");
const { connectDB } = require("../utils/helpers");

connectDB();
class ContainerMongo {
    constructor() {}

    async getMessages() {
        try {
            const messages = await Messages.find();
            return messages;
        } catch (error) {
            console.log(error);
        }
    }

    async saveMessage(msg) {
        try {
            new Messages(msg).save();
            return;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ContainerMongo;
