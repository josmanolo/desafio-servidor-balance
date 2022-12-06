const express = require("express");
const session = require("express-session");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const handlebars = require("express-handlebars");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const MessagesDao = require("./daos/messagesDao.js");
const authRouter = require("./routes/auth.routes");
const UsersDao = require("./daos/usersDao");
const parseArgs = require("minimist");
const cors = require('cors');
const args = parseArgs(process.argv.slice(2));

require("dotenv").config();

const { isValidPassword, createHash, upload, sendMail } = require("./utils/helpers.js");
const appRouter = require("./routes/app.routes.js");
const randomRouter = require("./routes/random.routes");

const Messages = new MessagesDao();
const Users = new UsersDao();
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    optionSuccessStatus: 200,
    method: ['GET', 'POST']
}

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors(corsOptions));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index",
        layoutsDir: __dirname + "/views",
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        rolling: true,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

/////////////////////////////////Passport///////////////////////////////////

passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "username", passwordField: "password" },
        async (username, password, done) => {
            try {
                const user = await Users.getUser({ username });

                if (user.length === 0) {
                    console.log("User not found");
                    return done(null, false, { message: "User not found" });
                }

                if (!isValidPassword(user.password, password)) {
                    console.log("Wrong Password");
                    return done(null, false, { message: "Wrong Password" });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
            }
        }
    )
);

passport.use(
    "signup",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const user = await Users.getUser({ username });
                const { name, email, age, tel } = req.body;

                if (user) {
                    console.log("User already exist");
                    return done(null, false, { message: "User already exist" });
                }

                const avatar = req.file.filename;

                const newUser = {
                    username,
                    password: createHash(password),
                    name,
                    email,
                    age,
                    tel,
                    avatar,
                };
                Users.saveUser(newUser)
                sendMail("user", newUser)
                return done(null, username);
            } catch (error) {
                console.log(error);
            }
        }
    )
);

passport.serializeUser((username, done) => {
    done(null, username);
});

passport.deserializeUser(async (username, done) => {
    const user = await Users.getUser({ username });
    done(null, user);
});

//////////////////////////////////////////////////////////////////////////////////
app.use(authRouter);
app.use(appRouter);
app.use(randomRouter);

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", (socket) => {
    socket.on("new-message", (msg) => {
        Messages.saveMessage(msg);

        const getDBMessages = async () => {
            const messages = await Messages.getMessages();
            socket.emit("new-message-server", messages);
        };

        getDBMessages();
    });
});

const PORT = args.port || process.env.PORT;
const clusterMode = args.mode === 'CLUSTER';

if(cluster.isPrimary && clusterMode) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    })
} else {
    httpServer.listen(PORT, () => {
        console.log(`Server running port ${PORT}`);
    });

    console.log(`Worker ${process.pid} started`);
}

