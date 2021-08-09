// 計算所有出現function花費的time
const { Console } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var fs = require('fs'),
    readline = require('readline');
const { resolve } = require('path');

let funcArr = [];
const fileDir = '0225_json_time' // input file dir 
const outputDir = 'func_time' // save file dir

async function auto_count(){
    fs.readdirSync(`./${fileDir}/`).forEach(file => {
        const fileName = file.split('.')[0];
        funcArr = []
        let delta = `./${fileDir}/${file}`;
        countFunc(delta, fileName)
    })
}
auto_count()

// count funcv
function countFunc(path, outputname){
    var rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });
    let funcName = ""
    return new Promise(resolve =>{
        rd.on('line', function (line) {
            if(line.includes('name')){
                const start = line.indexOf('name') + 8
                const end = line.indexOf('"', start)
                funcName = line.substring(start, end)
            }else if(line.includes('time')){
                const start = line.indexOf('time') + 7
                const end = line.indexOf(',', start)
                let funcTime = parseInt(line.substring(start, end))
                // 如果funcName已在funcArr內
                if(funcArr.find(element => element.name == funcName)){
                    let objIndex = funcArr.findIndex(element => element.name == funcName)
                    funcArr[objIndex].time += funcTime
                }else{
                    funcArr.push({name: funcName, time: funcTime})
                }
            }
        })
        .on('close', function(){  
            funcArr.sort(function(a, b) {
                return b.time - a.time;
            })
            // 建立資料夾
            if (!fs.existsSync(`./${outputDir}`)) {
                fs.mkdirSync(`./${outputDir}`)
            }
            fs.writeFileSync(`./${outputDir}/${outputname}.json`, JSON.stringify(funcArr, null, 2))
            resolve()
        });
    });
}
