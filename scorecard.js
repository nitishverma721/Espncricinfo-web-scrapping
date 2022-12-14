const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path"); 
const xlsx = require("xlsx");
// const { dirname } = require("path");
// const url = "https://www.espncricinfo.com/series/ipl-2021-1249214/chennai-super-kings-vs-kolkata-knight-riders-final-1254117/full-scorecard"

function processScorecard(url){
    request(url, cb);
}


function cb(error, response, html){
    if(error){
        console.error("error : ", error);
    } else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    let $ = cheerio.load(html);
    let descElem = $(".match-header-container .description");
    let result = $(".event .status-text");
    let stringArr = descElem.text().split(",");
    // console.log(descElem.text());
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();
    let innings = $(".match-scorecard-page .Collapsible");
    // let htmlStr = "";
    for(let i=0; i<innings.length; i++){
        // htmlStr += $(innings[i]).html();
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i==0?1:0;
        let opponentName = $(innings[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        // console.log(`${venue} || ${date} || ${teamName} || ${opponentName} || ${result}`);
        let cInnings = $(innings[i]);
        let allRows = cInnings.find(".table.batsman tbody tr");
        for(let j=0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if(isWorthy == true){
                // console.log(allCols.text());
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[4]).text().trim();
                let sixes = $(allCols[5]).text().trim();
                let sr = $(allCols[6]).text().trim();
                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, venue, date, opponentName, result);
            }
        }
        console.log("*************************************************************************************");
    }
    // console.log(htmlStr);
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, venue, date, opponentName, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        venue,
        date,
        opponentName,
        result 
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}
function excelWriter(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
function excelReader(filePath, sheetName) {
    if(fs.existsSync(filePath) == false){
        return [];
    }
    
        let wb = xlsx.readFile(filePath);
        let excelData = wb.Sheets[sheetName];
        let ans = xlsx.utils.sheet_to_json(excelData);
        return ans;
}

module.exports = {
    ps : processScorecard
}