const fs = require("fs");
const mongoose = require("mongoose");



// var MeguSchema = new mongoose.Schema({
//     h1:{type:String,
//         required:true},
//     h2:{type:String,
//         required:true}
// });

// mongoose.connect("mongodb://127.0.0.1/megu_database")


// console.log(img_num);
// bse64 的 encode 函式,詳細原理再去查,當時抄下來而已

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

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
    } else if (ua.indexOf("MiuiBrowser") != -1) {
        browser = "XiaoMi";
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
    let img_num = Math.floor(Math.random() * 4 ) + 1 ;
    let test_img = base64_encode(`square-image/${img_num}.png`);
    let img_string = "data:image/png;base64," + test_img;

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ;
    // 因為express的 req 會拿到的大多時候ipv4 map to ipv6 的格式 , 會長成::ffff:192.168.0.1 之類的樣子
    // 所以將前面的::ffff:使用 regex '/^.*:/' 替換成空字串
    
    ip = ip.replace(/^.*:/,'');

    let {device,browser} = getDevice(req.get("User-Agent"));

    let svg_img = 
    `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 660 125" style="enable-background:new 0 0 660 125;"  xml:space="preserve">
            <rect width="660" height="125" style="fill:gray;stroke-width:5;stroke:transparent" />
            <g>
                <image width='160' height='125' xlink:href='${img_string}'></image>
                <text transform="matrix(1 0 0 1 160 37.8271)" font-weight="bold" font-size="20px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">你的 IP 是${ip} </text>
                <text transform="matrix(1 0 0 1 160 69.9877)" font-weight="bold" font-size="20px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">使用 ${device} 的 ${browser} 瀏覽器</text>
                <text transform="matrix(1 0 0 1 160 103.7304)" font-weight="bold" font-size="20px" font-family="Microsoft JhengHei" fill="rgba(245, 9, 9, 0.932)">Explosion !!!</text>
            </g>
            <rect width="660" height="125" style="fill:none;stroke-width:5;stroke:rgb(236, 194, 194)" />
            <rect width="5" height="125" style="fill:rgb(236, 194, 194)" />
            <rect x="655" width="5" height="125" style="fill:rgb(236, 194, 194)" />
        </svg>
    `;
    
    return svg_img;
}

module.exports = makeImg;