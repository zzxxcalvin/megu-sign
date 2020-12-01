// const nodeHtmlToImage = require('node-html-to-image')
// 棄案,原本以為深海異音是將網頁轉成圖片結果發現不是

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
var makeImg = require("./image.js");
// const mongoose = require("mongoose");

// let uri = "mongodb://127.0.0.1/megu_database"
// mongoose.connect(uri,{ useNewUrlParser: true });
// mongoose.connect(uri, { useNewUrlParser: true,useUnifiedTopology: true });


// app.use(express.static(__dirname + '/static'));
// 測試 static 檔案用

app.get('/',(req,res)=>{
    res.send('你好呀，冒險者');
})

app.get('/ip',(req,res)=>{
    global.ip = req.connection.remoteAddress;
    res.send(global.ip);
});

app.get('/img',(req,res)=>{

    let img = makeImg(req);
    res.setHeader('content-type', 'image/svg+xml')
    // 透過 Set header 讓伺服器判斷這是一張 svg 圖片
    // 否則會被加上一般的 html tag 在前後變成網頁
    res.send(img);
});

app.listen(port,(req,res)=>{
    console.log(`App start at port ${port} ...`);
});