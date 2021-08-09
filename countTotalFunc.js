// 計算所有function name call 次數
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var fs = require('fs'),
    readline = require('readline');
const { resolve } = require('path');

let funcArr = [];
const fileDir = '0225_json_func_new' // input file dir 
const outputDir = 'func_call' // save file dir

async function auto_count(){
    const files = fs.readdirSync(`./${fileDir}/`);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.split('.')[0];
        funcArr = []
        let delta = `./${fileDir}/${file}`;
        console.log(fileName)
        await countFunc(delta, fileName) 
    }
}
auto_count()

// count funcv
function countFunc(path, outputname){
    var rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout
        // console: false
    });

    return new Promise(resolve =>{
        // 逐行讀
        rd.on('line', function (line) {
            if(line.includes('name')){
                const start = line.indexOf('name') + 8
                const end = line.indexOf('"', start)
                funcArr.push(line.substring(start, end))
            }
        })
        // 讀檔結束
        .on('close', function(){  
            // 建立資料夾
            if (!fs.existsSync(`./${outputDir}`)) {
                fs.mkdirSync(`./${outputDir}`)
            }
            fs.writeFileSync(`./${outputDir}/${outputname}.json`, JSON.stringify(getFrequency(funcArr), null, 2)) // save results
            resolve()
        });
    });
}

// 同func name累加
function getFrequency(arr) {
    var freq = {};
    for (var i=0; i<arr.length;i++) {
        if (freq[arr[i]]) {
           freq[arr[i]]++;
        } else {
           freq[arr[i]] = 1;
        }
    }
    return freq;
};
