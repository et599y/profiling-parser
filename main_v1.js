// 需定義欲執行資料夾名稱， parser 的 output_type，選擇 runAll() / runOne()
// 更改 obj 參數 format

const fs = require('fs');
const { type } = require('os');
let fileData = "";
let results = "";
const output_type = 'func' // define output type time, return, func

function getLayerMeta(startIndex) {
    // 處理 funName
    const funNameStartIndex = fileData.indexOf(' ', startIndex) + 1;
    const funNameEndIndex = fileData.indexOf(')', funNameStartIndex) + 1;   
    const funName = fileData.substring(funNameStartIndex, funNameEndIndex);
    
    // 處理 key
    let obj = {
        name: '',
        // time: '', //////// output type要改 /////////////
        child: [],
    };
    // let info = {
    //     arg: ""
    //     time: ""
    // };
    obj["name"] = funName; // save funName

    // start那行結束
    let nextLineStartIndex = fileData.indexOf('\r\n', funNameEndIndex + 1);

    // choose output type
    if(output_type == 'arg'){
        const countKeyStartIndex = fileData.indexOf('count = ', funNameEndIndex) + 8;
        const countKeyStartIndex2 = fileData.indexOf('@', funNameEndIndex) + 1; // 第二種arg格式
        if(nextLineStartIndex > countKeyStartIndex){
            const countKey = fileData.substring(countKeyStartIndex, countKeyStartIndex + 1); // 該function的parameter數量            
            // 判斷 arg
            if (countKey != 0){
                const keyValue = fileData.substring(countKeyStartIndex + 2, nextLineStartIndex);              
                obj["arg"] = keyValue;                 
            }else{
                obj["arg"] = null;
            }
        }else if(nextLineStartIndex > countKeyStartIndex2){
            const keyValue = fileData.substring(countKeyStartIndex2, nextLineStartIndex);              
            obj["arg"] = keyValue; 
        }else{
            obj["arg"] = null;
        }
    }else if(output_type == 'time'){
        const funEndIndex = fileData.indexOf(`*End ${funName}`, nextLineStartIndex); // 從該function start尾端開始找該function的end index
        const costTimeStartIndex = fileData.indexOf('CostTime:', funEndIndex) + 9; // 在end 找到costtime index
        const costTimeEndIndex = fileData.indexOf('.', costTimeStartIndex); // 取costtime整數
        obj["time"] = Math.abs(parseInt(fileData.substring(costTimeStartIndex, costTimeEndIndex)));
    }else if(output_type == 'return'){
        const funEndIndex = fileData.indexOf(`*End ${funName}`, nextLineStartIndex); // 從該function start尾端開始找該function的end index
        const costTimeStartIndex = fileData.indexOf('return:(', funEndIndex) + 8; // 在end 找到return index
        const costTimeEndIndex = fileData.indexOf('CostTime:', costTimeStartIndex) - 4; // 取return type
        obj["return"] = fileData.substring(costTimeStartIndex, costTimeEndIndex);
    }
    return obj;
}

function findStart(fromIndex) {
    const layerStr = `#Start#`;
    const layerStrSize = layerStr.length;
    const startIndex = fileData.indexOf(layerStr, fromIndex);
    const layerNumber = Number(fileData.substring(startIndex + layerStrSize, fileData.indexOf('#', startIndex + layerStrSize + 1)));

    if (startIndex >= 0) {
        return { index: startIndex, number: layerNumber }
    }
    return null;
}

function parseLayer() {
    const result = {
        name: 'root',
        child: [],
    };
    let currentLayer = 0;
    // schema: { parent, layerNumber }
    let parentStack = [];
    parentStack.push({ parent: result, layerNumber: currentLayer});

    for (let i = 0; i < fileData.length; i++) {
        const find = findStart(i);
        if (find) {
            const layerMeta = getLayerMeta(find.index);
            // 如果找到的不是下一層，丟掉 parentStack 直到是目前層的爸爸
            if (find.number <= currentLayer) {
                while(parentStack.length > 0) { 
                    const parentObj = parentStack[parentStack.length - 1];
                    if (parentObj.layerNumber < find.number) {
                        break;
                    }
                    else {
                        parentStack.pop();
                    }
                }

                // 錯誤檢查
                if (parentStack.length === 0) {
                    console.error('parentStack 不該為 0');
                }
            }

            parentStack[parentStack.length - 1].parent.child.push(layerMeta);
            // 每次做完都放進去，預防下次找到的是下一層 (避免找不到爸爸)
            parentStack.push({ parent: layerMeta, layerNumber: find.number});

            // 設定資訊
            currentLayer = find.number;
            i = find.index;
        }
    }

    return result;
}

// run all files
function runAll(folderName){
    // 建立資料夾
    const newFolderName = `0714_json_testSet2` // define folder name
    if (!fs.existsSync(`./${newFolderName}`)) {
        fs.mkdirSync(`./${newFolderName}`)
    }

    fs.readdirSync(`./${folderName}/`).forEach(file => {
        const fileName = file.split('.')[0];
        try{
            fileData = fs.readFileSync(`./${folderName}/${fileName}.txt`, { encoding: 'utf8'});
            const results = parseLayer();
            fs.writeFileSync(`./${newFolderName}/${fileName}.json`, JSON.stringify(results["child"], null, 2));
        } catch(e){
            console.log(fileName, e)
        }
    });
}
// runAll('testSet2')

// run one file
function runOne(){
    const fileName = 'toaster_patch_VGG16';
    fileData = fs.readFileSync(`./0225_側錄檔/${fileName}.txt`, { encoding: 'utf8'});
    const results = parseLayer();
    fs.writeFileSync(`./0225_json_${output_type}_new/${fileName}.json`, JSON.stringify(results['child'], null, 2));
}
runOne()