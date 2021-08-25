// 整理前兩層的total output diff count
var fs = require('fs'),
    readline = require('readline');
let json2xls = require('json2xls');
const { resolve } = require('path');
const fileDir = '0628_json_return_test' // input file folder
const outputDir = 'LayerOutput'

let org_cat = JSON.parse(fs.readFileSync(`./${fileDir}/1-1.json`)); // baseline

let temp = []
let num = 0
fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    let totaljson = []
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
    for (let i = 0; i < org_cat.length; i++) {
        // 第一層 有無diff
        if(fileData[i].return != org_cat[i].return){ 
            temp = [{ name: 1+org_cat[i].name, count: 1 }] 
        } else{
            temp = [{ name: 1+org_cat[i].name, count: 0 }] 
        }

        // 第二層 有無diff
        for(let x=0; x<org_cat[i].child.length; x++){
            let funcName = org_cat[i].child[x].name
            if(funcName == org_cat[i].child[x].name){ // 確保兩個檔案執行的func相同
                num = 0
                if(fileData[i].child[x].return != org_cat[i].child[x].return) num = 1 // 若第二層有不同 count加一
                countFunc(org_cat[i].child[x].child, fileData[i].child[x].child) // 計算第三層以下的diff count
                tempCheck(funcName, num)
            }
        }
        totaljson = totaljson.concat(temp);
        // 建立資料夾
        if (!fs.existsSync(`./${outputDir}`)) {
            fs.mkdirSync(`./${outputDir}`)
        }
        fs.writeFileSync(`./${outputDir}/${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
    }
});

function tempCheck(func, c) {
    let check = false
    temp.forEach(x => {
        if (x.name == func) {
            check = true
            x.count += c
            return false;
        }
    });
    if (check == false) temp.push({ name: func, count: c })
}

function countFunc(benchmark, data) {
    // 判斷array size是否為空
    if (benchmark.length > 0) {
        for (let i = 0; i < benchmark.length; i++) {
            if(data[i]){
                if(benchmark[i].name == data[i].name && benchmark[i].return != data[i].return){
                    num += 1
                }
                countFunc(benchmark[i].child, data[i].child)
            }   
        }
    }
}