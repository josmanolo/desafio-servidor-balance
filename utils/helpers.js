const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
require('dotenv').config()

const isValidPassword = (userBDPassword, password) => {
    return bcrypt.compareSync(password, userBDPassword);
};

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

module.exports = { isValidPassword, checkAuth, connectDB, createHash, upload };