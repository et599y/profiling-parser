// 需定義欲執行資料夾名稱與 parser 的 output_type
// 更改 layerMeta json format

const fs = require('fs');
const JsonStreamStringify = require('json-stream-stringify')
let fileData = "";
const output_type = 'func' // define output type: function, return, arg, time

function getLayerMeta(line) {
    // choose output type
    if(output_type == 'time'){
        const funEndIndex = fileData.indexOf(`*End ${funName}`, nextLineStartIndex); // 從該function start尾端開始找該function的end index
        const costTimeStartIndex = fileData.indexOf('CostTime:', funEndIndex) + 9; // 在end 找到costtime index
        const costTimeEndIndex = fileData.indexOf('.', costTimeStartIndex); // 取costtime整數
        let obj = Math.abs(parseInt(fileData.substring(costTimeStartIndex, costTimeEndIndex)));
    }else if(output_type == 'return'){
        const funEndIndex = fileData.indexOf(`*End ${funName}`, nextLineStartIndex); // 從該function start尾端開始找該function的end index
        const returnStartIndex = fileData.indexOf('return:(', funEndIndex) + 8; // 在end 找到return index
        const returnEndIndex = fileData.indexOf('CostTime', returnStartIndex); // 取return value
        let obj = fileData.substring(returnStartIndex, returnEndIndex - 4) // 去掉最後多的字元
    }

    return obj;
}

function findLayer(lineData) {
    const layerStr = `#Start#`;
    const layerStrSize = layerStr.length;
    const startIndex = lineData.indexOf(layerStr, 0);
    const layerNumber = Number(lineData.substring(startIndex + layerStrSize, lineData.indexOf('#', startIndex + layerStrSize + 1)));

    if (startIndex >= 0) {
        return layerNumber 
    }
    return null;
}

let parentStack = [];
let results = {
    name: 'root',
    child: [],
};

let currentLayer = 0;
let cutStr = ''
const startFunctionNameCount = {};
const endFunctionNameCount = {};

function parseLayer(data){
    // 判斷斷頭斷尾
    data = cutStr + data
    cutStr = '' // 每次清空
    
    //一行一行讀
    var lines = data.split('\n');
    // 斷頭斷尾補上
    if (data.lastIndexOf('\n') != data.length) {
        cutStr = lines.pop();
    }

    lines.forEach(function(line, index) {
        let layer = findLayer(line)
        if(layer !== null){
            const layerMeta = {
                name: '',
                time: 0, ////////// output_type change
                child: [],
            };
            // 取function name
            const funNameStartIndex = line.indexOf(' ', line.indexOf('#Start#')) + 1;
            const funNameEndIndex = line.indexOf(')', funNameStartIndex) + 1;   
            const funName = line.substring(funNameStartIndex, funNameEndIndex);
            layerMeta["name"] = funName;
        
            if(layerMeta.name == '') console.log(lines, index)
            parentStack[parentStack.length - 1].parent.child.push(layerMeta);
            parentStack.push({ parent: layerMeta, layerNumber: layer});

            // 設定資訊
            currentLayer = layer;

            // test
            startFunctionNameCount[funName] = startFunctionNameCount[funName] ? startFunctionNameCount[funName] + 1 : 1;
        }else if(line.includes('*End')){
            // 判斷 output value & costtime

            const funStartIndex = line.indexOf('*End') + 5;
            const funEndIndex = line.indexOf(')', funStartIndex) + 1;
            const fun = line.substring(funStartIndex, funEndIndex);
            
            // test
            endFunctionNameCount[fun] = endFunctionNameCount[fun] ? endFunctionNameCount[fun] + 1 : 1;

            if(parentStack[parentStack.length - 1].parent.name == fun){
                
                // 找值
                if(output_type == 'time'){
                    const costTimeStartIndex = line.indexOf('CostTime:', funEndIndex) + 9; // 在end 找到costtime index
                    const costTimeEndIndex = line.indexOf('.', costTimeStartIndex); // 取costtime整數
                    const costTime = Math.abs(parseInt(line.substring(costTimeStartIndex, costTimeEndIndex)));
                    if(costTime > 0){
                        parentStack[parentStack.length - 1].parent.time = costTime
                        // console.log(fun, parentStack[parentStack.length - 1].parent)
                    }
                }else if(output_type == 'return'){
                    const returnStartIndex = line.indexOf('return:(', funEndIndex) + 8; // 在end 找到return index
                    const returnEndIndex = line.indexOf('CostTime', returnStartIndex); // 取return value
                    parentStack[parentStack.length - 1].parent.return = line.substring(returnStartIndex, returnEndIndex - 4) // 去掉最後多的字元
                }
                parentStack.pop();
            }else{
                console.log(fun, parentStack[parentStack.length - 1].parent.name)
            }
        }
        //若return value不只一行
        else if(line.includes('CostTime')){ 
            // console.log(line)
            if(output_type == 'return'){
                // 找return value的後括號

            }else if(output_type == 'time'){
                const costTimeStartIndex = line.indexOf('CostTime:') + 9; // 在end 找到costtime index
                const costTimeEndIndex = line.indexOf('.', costTimeStartIndex); // 取costtime整數
                parentStack[parentStack.length - 1].parent.time = Math.abs(parseInt(line.substring(costTimeStartIndex, costTimeEndIndex)));
                parentStack.pop();
            }
        }else{
            parentStack[parentStack.length - 1].parent.return += line
        }
    });
}

async function runAll(folderName){
    // 建立資料夾
    const newFolderName = `0225_json_${output_type}_test2` // 定義新資料夾名稱
    if (!fs.existsSync(`./${newFolderName}`)) {
        fs.mkdirSync(`./${newFolderName}`)
    }

    const fileNum = fs.readdirSync(`./${folderName}/`)
    for(let i=0; i<fileNum.length; i++) {
        let file = fileNum[i]
        results = {
            name: 'root',
            child: [],
        };
        parentStack = [];
        currentLayer = 0;
        parentStack.push({ parent: results, layerNumber: currentLayer});

        const promise = new Promise(resolve => {
            const fileName = file.split('.')[0];

            var readerStream = fs.createReadStream(`./${folderName}/${fileName}.txt`);
            readerStream.setEncoding("UTF8");
            var writeStream = fs.createWriteStream(`./${newFolderName}/${fileName}.json`)

            readerStream.on("data", function(chunk) {
                parseLayer(chunk.toString());
            });

            readerStream.on("end", function() {
                console.log(file)
                // const jsonStream = new JsonStreamStringify(Promise.resolve(Promise.resolve(results["child"])))
                // jsonStream.pipe(writeStream)
                // jsonStream.on('end', () => console.log('done'))
                writeStream.write(JSON.stringify(results["child"]), () => {
                    resolve()
                })
            });
        })
        await promise

    }
}

runAll('0225_側錄檔') // folder name