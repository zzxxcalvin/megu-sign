// const nodeHtmlToImage = require('node-html-to-image')
const fs = require("fs");
const express = require("express");
const app = express();

const img = require('./image.js');

const port = process.env.PORT || 3000;

var ip;

//load the image
// const image = fs.readFileSync('./static/megu.jpg');
// const image2Base64 = new Buffer.from(image).toString('base64');
// const dataURL = 'data:image/jpg;base64,' + image2Base64;

// 簽名檔 長寬 w 660 h 125

// base64 圖片顯示的html語法 
// data:image/jpg;base64, (base64的圖片).............


let makeImg = (req)=>{
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ;
    let svg_img = 
    `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 660 125" style="enable-background:new 0 0 660 125;" xml:space="preserve">
            <g>
                <text transform="matrix(1 0 0 1 148 37.8271)" font-size="12px" >你的 IP 是${ip}</text>
                <text transform="matrix(1 0 0 1 148 69.9877)" font-size="12px">這是偉大魔法的測試</text>
                <text transform="matrix(1 0 0 1 148 103.7304)" font-size="12px">希望我會做完</text>
            </g>
        </svg>
    `;
    return svg_img;
}

app.use(express.static(__dirname + '/static'));

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.get('/answer',(req,res)=>{
    res.send(img);
})

app.get('/ip',(req,res)=>{
    global.ip = req.connection.remoteAddress;
    res.send(global.ip);
});

app.get('/img',(req,res)=>{
    let img = makeImg(req);
    res.setHeader('content-type', 'image/svg+xml')
    res.send(img);
});

// app.listen(port,'127.0.0.1',(req,res)=>{
//     console.log(`App start at port ${port} ...`);
// });

app.listen(port,(req,res)=>{
    console.log(`App start at port ${port} ...`);
});