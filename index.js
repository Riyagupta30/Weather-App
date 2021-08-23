const http = require("http"); // Import Node.js core module
const fs = require("fs"); // Import Node.js core module
var requests = require("requests");


const homeFile = fs.readFileSync("home.html","utf-8"); // Import html file in node

 
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

// create a server
const server = http.createServer((req,res)=>{
    if(req.url == "/") {
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=pune&appid=423184e38b9f635a41a9d52d4865b719"
           )
           .on("data", (chunk) => {
               const objdata = JSON.parse(chunk);
               const arrData = [objdata];
               //console.log(arrData[0].main.temp);
               const realTimeData = arrData.map((val)=> replaceVal(homeFile, val)).join("");  // val is API
               res.write(realTimeData);
               //console.log(realTimeData);
           })
           .on("end", (err) => {
               if(err) return console.log("connection closed due to errors", err);
               res.end();
           });
    }
});

server.listen(5500, "127.0.0.1");