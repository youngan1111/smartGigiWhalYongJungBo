const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { google } = require("googleapis");
const token = require("./token.json");
const credentials = require("./credentials.json");

const getPage = () => {
    axios({
        method: 'get',
        url: 'https://news.appstory.co.kr/plan14022',
        responseType: 'arraybuffer'
    })
        .then(function (response) {
            let $ = cheerio.load(iconv.decode(response.data, 'EUC-KR').toString())

            console.log($('#read').children('div.article_top').children('div.crop_img_wrap').children('div.desc_group').children('h1').text())

            let arr = $('#read').children('div.board_read').children('p')

            for (let i = 0; i < arr.length; i++) {
                console.log(i)
                if ($(arr[i]).text() === '') {
                    console.log($(arr[i]).children('img').attr('src'))
                } else console.log($(arr[i]).text())
            }

        });
}

getPage()