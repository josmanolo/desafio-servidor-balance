const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const nodemailer = require("nodemailer");
const twilio = require("twilio")
require("dotenv").config();

const isValidPassword = (userBDPassword, password) => {
    return bcrypt.compareSync(password, userBDPassword);
};

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
};

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL;
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
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = async (type, info) => {
    try {
        const mailOptions = {
            from: "Servidor Node.js",
            to: "jomalolep@gmail.com",
            subject: type === "user" ? "Nuevo Registro" : "Nuevo Pedido",
            html:
                type === "user"
                    ? `<h1 style="color: blue;">Nuevo Registro</h1><ul><li>${info.username}</li><li>${info.name}</li><li>${info.email}</li><li>${info.age}</li><li>${info.tel}</li></ul>`
                    : `<h1 style="color: blue;">Nuevo Registro</h1><p>Has recibido un pedido de ${info.username}</p><ul><li>Jersey Mexico - $1,000</li></ul>`,
            attachments: [
                {
                    path: "https://raw.githubusercontent.com/andris9/Nodemailer/master/assets/nm_logo_200x136.png",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

const sendSms = async (tel) => {
    try {
        const message = await client.messages.create({
           body: 'Tu pedido ha sido recibido!',
           from: ':+14155238886',
           to: `:+521${tel}`
        })
        console.log(message)
     } catch (error) {
        console.log(error)
     }

}



module.exports = {
    isValidPassword,
    checkAuth,
    connectDB,
    createHash,
    upload,
    sendMail,
    sendSms,
};
