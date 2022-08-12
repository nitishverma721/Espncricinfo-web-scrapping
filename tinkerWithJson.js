const fs = require("fs");
const xlsx = require("xlsx");


// let buffer = fs.readFileSync("./example.json")
// console.log(buffer);
// console.log("*******************");

// we get data in array
// let data = JSON.parse(buffer);     
// console.log(data);


// agar data direct cahiye json file se to direct request karlo
let data = require("./example.json");

// console.log(data);
// data.push({
//     "first name" : "samyak",
//     "last name" : "jain",
//     "gender" : "male"
// })

// read karliya data ko 
// agar data mein kuch add karna hai to usse pehle **String** mein convert karo 
//  fir uske baad writefilesync kaa use karo
// let stringdata = JSON.stringify(data)
// fs.writeFileSync("example.json", stringdata);


// *******WRITE****************
// wb -> filePath, ws -> name, json data
//new book
// json data -> excel formal convert
// -> newdb, ws, sheet name
// //filepath

function excelWriter(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

// ***************READ****************
// workbook get karne ke liye
// sheet get karne ke liye
// sheet ka data get karne ke liye
// console.log(ans);

function excelReader(sheetName, filePath) {
if(fs.existsSync(filePath) == false){
    return [];
}

    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}