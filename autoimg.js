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

let getDevice = (ua)=>{
    
    // User-Agent 裡面存放了 裝置資訊、瀏覽器資訊、渲染引擎等等
    // 這些資訊比我想像中還好取得(?)
    // 詳細歷史 : https://www.zhihu.com/question/306775584


    let browser = "";
    let device = "";

    if(ua.indexOf("Chrome") != -1){
        browser = "Chrome";
    } else if (ua.indexOf("Firefox") != -1) {
        browser = "Firefox";
    } else if (ua.indexOf("Safari") != -1 && ua.indexOf("CriOS") != -1 && ua.indexOf("Mobile") != -1){
        browser = "Chrome";
    } else if (ua.indexOf("Safari") != -1) {
        browser = "Safari";
    } 
    
    if(ua.indexOf("Windows") != -1){
        //Windows 系列
        if( ua.indexOf("10.0") != -1 ){
            device = "Windows 10";
        } else if ( ua.indexOf("6.3") != -1 ){
            device = "Windows 8.1";
        } else if ( ua.indexOf("6.2") != -1 ){
            device = "Windows 8";
        } else if ( ua.indexOf("6.1") != -1 ){
            device = "Windows 7";
        } else if ( ua.indexOf("6.0") != -1 ){
            device = "Windows Vista";
        } else if ( ua.indexOf("5.2") != -1 || ua.indexOf("5.1") != -1){
            device = "Windows XP";
        }
    } else if( ua.indexOf("Mac OS") != -1 ){
        // Mac
        device = "Mac";
    } else if( ua.indexOf("android") != -1 ){
        // Mac
        device = "Android";
    } else if( ua.indexOf("Ubuntu") != -1 ){
        // Mac
        device = "Ubuntu";
    }

    return {browser,device};
}


let makeImg = (req)=>{
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ;
    // 因為express的 req 會拿到的大多時候ipv4 map to ipv6 的格式 , 會長成::ffff:192.168.0.1 之類的樣子
    // 所以將前面的::ffff:使用 regex '/^.*:/' 替換成空字串
    ip = ip.replace(/^.*:/,'');

    let {device,browser} = getDevice(req.get("User-Agent"));


    let svg_img = 
    `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 660 125" style="enable-background:new 0 0 660 125;" xml:space="preserve">
            <rect width="660" height="125" style="fill:rgb(236, 194, 194);stroke-width:10;stroke:rgba(240, 81, 7, 0.932)" />
        
            <g>
                <text transform="matrix(1 0 0 1 148 37.8271)" font-weight="bold" font-size="22px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">你的 IP 是${ip} </text>
                <text transform="matrix(1 0 0 1 148 69.9877)" font-weight="bold" font-size="22px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">使用 ${device} 開 ${browser} 瀏覽器</text>
                <text transform="matrix(1 0 0 1 148 103.7304)" font-weight="bold" font-size="22px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">Everything just works like Magic </text>
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
    // let ua = req.get("User-Agent");
    let img = makeImg(req);
    // console.log(ua);
    res.setHeader('content-type', 'image/svg+xml')
    res.send(img);
});

// app.listen(port,'127.0.0.1',(req,res)=>{
//     console.log(`App start at port ${port} ...`);
// });

app.listen(port,(req,res)=>{
    console.log(`App start at port ${port} ...`);
});