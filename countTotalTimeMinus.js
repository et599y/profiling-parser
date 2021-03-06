// 計算total function time 數量 以 baseline 算差值
var fs = require('fs')
let json2xls = require('json2xls');
const fileDir = 'func_time' // file dir
const outputDir = 'time_all'

org_cat = JSON.parse(fs.readFileSync(`./${fileDir}/org_1.json`)); // baseline
let sortable = org_cat.slice(0,50) // 取前50個
console.log(sortable) 

fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    let totaljson = []
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
    let temp = []
    for(let i=0; i < sortable.length; i++){ 
        let funcName = sortable[i].name
        let objIndex = fileData.findIndex(element => element.name == funcName)
        temp.push({name: funcName, value: parseInt(fileData[objIndex].time) - sortable[i].time}) // save diff
    }
    totaljson = totaljson.concat(temp);
    // 建立資料夾
    if (!fs.existsSync(`./${outputDir}`)) {
        fs.mkdirSync(`./${outputDir}`)
    }
    fs.writeFileSync(`./${outputDir}/${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
});