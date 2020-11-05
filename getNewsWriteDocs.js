const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { google } = require("googleapis");
const token = require("./token.json");
const credentials = require("./credentials.json");
const prompt = require("prompt");

function authorize() {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

module.exports = () => {
    prompt.start();

    console.log('크롤링할 앱스토리 기획의 번호를 적어주세요 ex)"https://news.appstory.co.kr/plan13998"의 "plan13998"')
    prompt.get(['url'], function (err, res) {
        axios({
            method: 'get',
            url: `https://news.appstory.co.kr/${res.url}`,
            responseType: 'arraybuffer'
        })
            .then(async function (response) {
                let requests = [];

                let $ = cheerio.load(iconv.decode(response.data, 'EUC-KR').toString())

                let arr = $('#read').children('div.board_read').children('p')

                for (let i = arr.length - 1; i >= 0; i--) {
                    if (typeof $(arr[i]).find("img").attr('src') !== 'undefined') {
                        requests.push(
                            {
                                insertInlineImage: {
                                    location: { index: 1 },
                                    uri: $(arr[i]).find("img").attr('src')
                                }
                            }
                        )
                    } else {
                        // if ($(arr[i]).text().indexOf('\n') > 0) $(arr[i]).text().replace(/\n/gi, '');
                        requests.push(
                            {
                                insertText: {
                                    location: {
                                        index: 1
                                    },
                                    text: $(arr[i]).text() + '\n'
                                }
                            }
                        )
                    }
                }

                requests.push(
                    {
                        insertText: {
                            location: {
                                index: 1
                            },
                            text: $('#read').children('div.article_top').children('div.crop_img_wrap').children('div.desc_group').children('h1').text()
                        }
                    }
                )

                const auth = await authorize();
                const docs = google.docs({
                    version: "v1",
                    auth
                });
                await docs.documents.batchUpdate({
                    auth,
                    documentId: '1BtTeL1l1fhJPEE04Hz3xlAEsFcmDirlO3WlLczqWga0',
                    requestBody: {
                        requests
                    }
                });

                console.log('done!')
            });
    });
}
