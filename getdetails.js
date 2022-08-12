const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const allMatchObj = require("./allMatch");

const iplPath = path.join(__dirname, "ipl");
dirCreater(iplPath);

const url = "https://www.espncricinfo.com/series/ipl-2021-1249214"

console.log("before");

request(url, cb);

function cb(error, response, html){
    if(error){
        console.error("error : ", error);
    } else{
        extractHtml(html);
    }
}

function extractHtml(html) {
    let $ = cheerio.load(html);

    let anchorElem = $(".widget-items.cta-link");
    let href = $(anchorElem[0]).find("a").attr("href");
    let fullLink = "https://www.espncricinfo.com"+href;
    allMatchObj.gAlMatches(fullLink);
    
    //  console.log(fullLink);

}

function dirCreater(filePath) {
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}


console.log("after");
