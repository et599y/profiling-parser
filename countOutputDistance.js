// count output value distance
var fs = require('fs')
var _ = require('underscore');
var scaler = require('minmaxscaler');
var json2xls = require('json2xls');
const fileDir = '0507_json_return' // change file dir
const outputDir = 'OutputDiff'
var output_type = "str" // change type: str, int, float, bool
var num = 0

// 計算字串相異度
const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    // console.log(track[str2.length][str1.length] / Math.max(str1.length, str2.length))
    return track[str2.length][str1.length]
};

let org_cat = JSON.parse(fs.readFileSync(`./${fileDir}/org_1.json`)); // baseline
fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
    let totaljson = []
    for (let i = 0; i < org_cat.length; i++) {
        num = 0
        if(org_cat[i].return.split(':')[0] == output_type && fileData[i].return.split(':')[0] == output_type){  // check 第一層 有無該型別 
            // 去掉多餘字符
            let d1 = org_cat[i].return.split(':')[1].trim() 
            let d2 = fileData[i].return.split(':')[1].trim()
            if(d1 != d2) num = Euclidean(d1, d2) // 計算兩個file output value distance
        }
        temp = [{ name: org_cat[i].name, count: num }] // 暫存結果

        // 第二層
        for(let x=0; x<org_cat[i].child.length; x++){
            let funcName = org_cat[i].child[x].name
            num = 0 
            if(org_cat[i].child[x].return.split(':')[0] == output_type && fileData[i].child[x].return.split(':')[0] == output_type){
                let d1 = org_cat[i].child[x].return.split(':')[1].trim()
                let d2 = fileData[i].child[x].return.split(':')[1].trim()
                if(d1 != d2) num += Euclidean(d1, d2)
            }
            countFunc(org_cat[i].child[x].child, fileData[i].child[x].child) // 第三層以下
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
            if(data[i]){
                if(benchmark[i].name == data[i].name && (benchmark[i].return.split(':')[0] == output_type && data[i].return.split(':')[0] == output_type)){
                    let d1 = benchmark[i].return.split(':')[1].trim()
                    let d2 = data[i].return.split(':')[1].trim()
                    if(d1 != d2) num += Euclidean(d1, d2)
                }
                countFunc(benchmark[i].child, data[i].child)
            }   
        }
    }
}

function Euclidean(data1, data2){
    var distance = 0 // distance起始為0
    switch(output_type){
        case 'int':
            distance = Math.sqrt(Math.pow((parseInt(data1) - parseInt(data2)),2)) //相減平方總和
            return distance 
        case 'float':
            console.log(data1, data2)
            distance = Math.sqrt(Math.pow((parseFloat(data1) - parseFloat(data2)),2)) //相減平方總和
            return distance  
        case 'str':
            if(!(Number(data1) && Number(data2))){
                return levenshteinDistance(data1, data2)
            }
        case 'bool':
            return 1; // 若不相等 差異值為1
    } 
}

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

