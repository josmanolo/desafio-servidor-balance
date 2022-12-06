const { connectDB } = require("../utils/helpers");
const Users = require("../models/users.model");

class UsersDao {
    constructor() {
        connectDB();
    }

    getUser = async (username) => {
        return await Users.find({ username });
    }

    saveUser = async (newUser) => {
        new Users(newUser).save();
    }

}

module.exports = UsersDao;