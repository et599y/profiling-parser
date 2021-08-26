// 計算所有function name call 次數
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var fs = require('fs'),
    readline = require('readline');
const { resolve } = require('path');

let funcArr = [];
const fileDir = '0507_json_func' // input file dir 
const outputDir = 'func_call' // save file dir
// 建立資料夾
if (!fs.existsSync(`./${outputDir}`)) {
    fs.mkdirSync(`./${outputDir}`)
}

async function auto_count() {
    const files = fs.readdirSync(`./${fileDir}/`);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.split('.')[0];
        funcArr = [] // 每次清空
        let delta = `./${fileDir}/${file}`;
        let fileData = JSON.parse(fs.readFileSync(delta));
        console.log(fileName)
        eachFunc(fileData)
        fs.writeFileSync(`./${outputDir}/${fileName}.json`, JSON.stringify(getFrequency(funcArr), null, 2)) // save results
    }
}
auto_count()

function eachFunc(data) {
    for (let i = 0; i < data.length; i++) {
        funcArr.push(data[i].name) // 存入func name
        // 若還有child
        if (data[i].child.length != 0) {
            eachFunc(data[i].child)
        }
    }
}


// 同func name累加
function getFrequency(arr) {
    var freq = {};
    for (var i = 0; i < arr.length; i++) {
        if (freq[arr[i]]) {
            freq[arr[i]]++;
        } else {
            freq[arr[i]] = 1;
        }
    }
    return freq;
};
