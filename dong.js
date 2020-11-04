
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

axios({
    method: 'get',
    url: `https://news.appstory.co.kr/plan13998`,
    responseType: 'arraybuffer'
})
    .then(async function (response) {

        let $ = cheerio.load(iconv.decode(response.data, 'EUC-KR').toString())


        console.log($('#read').children('div.board_read').children('p:nth-child(25)').children('span').text())



    })