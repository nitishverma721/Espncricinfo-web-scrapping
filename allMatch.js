const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecard");

function getAllMatchesLink(url){
    request(url, function (error, response, html){
        if(error){
            console.error("error : ", error);
        } else{
            extractAllLinks(html);
        }
    });
    
}

function extractAllLinks(html){
    let $ = cheerio.load(html);
    let scorecardElems = $("a[data-hover='Scorecard']");
    for(let i=0; i<scorecardElems.length; i++){
        let link = $(scorecardElems[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com"+link;
        console.log(fullLink);
        scorecardObj.ps(fullLink);
    }
    
}

module.exports= {
    gAlMatches : getAllMatchesLink
}