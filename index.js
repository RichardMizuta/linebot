const server = require("express")();
const line = require("@line/bot-sdk");
const { response } = require("express");
const a = 2;

//環境設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

//接続を確立
server.listen(process.env.PORT || 3000);

//APIコールのためのクライアントインスタンス作成
const bot = new line.Client(line_config);

//ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req,res,next) => {
    //先行してline側にステータスコード200でレスポンス
    res.sendStatus(200);
    console.log(req.body);

    //イベント処理のプロミスを格納する配列
    let events_processed = [];

    //イベント(メッセージが送られること)に対し、処理を記述
    //クライアントからのリクエストのボディのイベント(例：「こんにちは」)に対して返信したい
    req.body.events.forEach((event) => {
        if (event.type == "message" && event.message.type == "text"){
            if (event.message.text == "こんにちは") {
                //replyMessage()で返信し、そのプロミス(型はboolen、すなわちイベントがうまくいったかどうか)を
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "これはこれは"
                }));
            }
        }
    });
    //何個のイベントが処理されたか出力
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed`);
        }
    )
});
