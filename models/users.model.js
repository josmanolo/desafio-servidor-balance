const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
});

module.exports = mongoose.model("Users", UsersSchema);
