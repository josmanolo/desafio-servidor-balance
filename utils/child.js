const generateRandomNums = (num) => {
    const randomNumbers = {};

    for (let i = 0; i < num; i++) {
        const randomNum = Math.floor(Math.random() * 1000 + 1);
        const numOnObj = randomNumbers[randomNum];

        numOnObj
            ? (randomNumbers[randomNum] = numOnObj + 1)
            : (randomNumbers[randomNum] = 1);
    }

    return randomNumbers;
};

process.on("message",  (num) => {
    const randomObj = generateRandomNums(num);
    process.send(randomObj);
});
