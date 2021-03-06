// count matrix diff
var fs = require('fs')
var _ = require('underscore');
var scaler = require('minmaxscaler');
var json2xls = require('json2xls');
var folder = "0507_json_return" // change folder name
const outputDir = 'OutputDiff'
var num = 0

let org_cat = JSON.parse(fs.readFileSync(`./${folder}/org_1.json`)); // baseline
fs.readdirSync(`./${folder}/`).forEach(file => {
    const fileName = file.split('.')[0];
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${folder}/${fileName}.json`));
    let totaljson = []
    for (let i = 0; i < org_cat.length; i++) {
        num = 0
        if (org_cat[i].return.includes('str:[[') && fileData[i].return.includes('str:[[')) {  // 第一層 有無該型別 
            let d1 = org_cat[i].return.split(':')[1].trim() // 去掉多餘字符
            let d2 = fileData[i].return.split(':')[1].trim()
            if (d1 != d2) num = Euclidean(d1, d2) // 計算兩個file output vale distance
        }
        temp = [{ name: org_cat[i].name, count: num }]

        // 第二層
        for (let x = 0; x < org_cat[i].child.length; x++) {
            let funcName = org_cat[i].child[x].name
            num = 0
            if (org_cat[i].child[x].return.includes('str:[[') && fileData[i].child[x].return.includes('str:[[')) {
                let d1 = org_cat[i].child[x].return.split(':')[1].trim()
                let d2 = fileData[i].child[x].return.split(':')[1].trim()
                if (d1 != d2) num += Euclidean(d1, d2)
            }
            countFunc(org_cat[i].child[x].child, fileData[i].child[x].child) //第三層
            tempCheck(funcName, num)
        }
        totaljson = totaljson.concat(temp);
    }
    // 建立資料夾
    if (!fs.existsSync(`./${outputDir}`)) {
        fs.mkdirSync(`./${outputDir}`)
    }
    fs.writeFileSync(`./${outputDir}/${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel
});

function countFunc(benchmark, data) {
    // 判斷array size是否為空
    if (benchmark.length > 0) {
        for (let i = 0; i < benchmark.length; i++) {
            if (data[i]) {
                if (benchmark[i].name == data[i].name && (benchmark[i].return.includes('str:[[') && data[i].return.includes('str:[['))) {
                    let d1 = benchmark[i].return.split(':')[1].trim()
                    let d2 = data[i].return.split(':')[1].trim()
                    if (d1 != d2) num += Euclidean(d1, d2)
                }
                countFunc(benchmark[i].child, data[i].child)
            }
        }
    }
}

function Euclidean(data1, data2) {
    var distance = 0 // distance起始為0
    data1 = data1.replace(/\.\.\.,/g, '').replace(/\.(?=\D)/g, ''); // 正規化
    data1 = _.flatten(JSON.parse(data1));
    data2 = data2.replace(/\.\.\.,/g, '').replace(/\.(?=\D)/g, '');
    data2 = _.flatten(JSON.parse(data2));

    for (var i = 0; i < Math.min(data1.length, data2.length); i++) {
        distance += Math.pow((data1[i] - data2[i]), 2) //相減平方總和
    }
    return distance
}

function tempCheck(func, c) {
    let check = false
    if (func == "load_weights()") console.log(c)
    temp.forEach(x => {
        if (x.name == func) {
            check = true
            x.count += c
            return false;
        }
    });
    if (check == false) temp.push({ name: func, count: c })
}

