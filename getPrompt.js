const prompt = require("prompt");

const hello = async () => {





    await prompt.start();
    let url = ''
    await prompt.get(['url'], function (err, res) {
        url = res.url

    });

    console.log(url)
}

hello()