// 計算total function call 數量，以baseline算差值
var fs = require('fs')
let json2xls = require('json2xls');
const fileDir = 'func_call' // change folder name
const outputDir = 'func_all'

let org_cat = JSON.parse(fs.readFileSync(`./${fileDir}/org_1.json`)); // baseline
var sortable = [];
// 取前50個執行次數最多的func
for (var vehicle in org_cat) {
    sortable.push({name: vehicle, value: org_cat[vehicle]});
}
sortable.sort(function(a, b) {
    return b.value - a.value;
})
sortable = sortable.slice(0,50) 
console.log(sortable) 

// 依序讀資料夾內各檔案
fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    let totaljson = []
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
    let temp = []
    for(let i=0; i < sortable.length; i++){ 
        let funcName = sortable[i].name
        // find func
        Object.entries(fileData).forEach(([key, value]) => {
            if(key == funcName){
                // temp.push({name: funcName, value: fileData[funcName] - sortable[i].value})
                temp.push({name: funcName, value: value})
            }else{
                console.log('can not find function')
            }
        });
    }
    totaljson = totaljson.concat(temp);
    if (!fs.existsSync(`./${outputDir}`)) {
        fs.mkdirSync(`./${outputDir}`)
    }
    fs.writeFileSync(`./${outputDir}/${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
});