const express = require("express");
const { Router } = express;
const { fork } = require("child_process");

const randomRouter = Router();

randomRouter.get("/info", (req, res) => {
    res.json({
        os: process.platform,
        nodeVersion: process.version,
        rrs: process.memoryUsage().rss,
        path: process.cwd(),
        processId: process.pid,
    });
});

randomRouter.get("/api/random", (req, res) => {
    const randomNum = req.query.num || 100000000;
    const child = fork("./utils/child");
    child.send(randomNum);

    child.on("message", (obj) => {
        res.json(obj);
    });
    
});

module.exports = randomRouter;