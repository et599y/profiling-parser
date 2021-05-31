const fs = require('fs');
const { type } = require('os');
let fileData = "";
const startLayer = 1 // 起始Layer
const layerStr = `#Start#${startLayer}`;
const layerStrSize = layerStr.length - 1;
var nLayer = 1 // parser n 層

function getLayerMeta(startIndex) {
    // 處理 funName
    const funNameStartIndex = fileData.indexOf(' ', startIndex) + 1;
    const funNameEndIndex = fileData.indexOf(')', funNameStartIndex) + 1;   
    const funName = fileData.substring(funNameStartIndex, funNameEndIndex);
    
    let obj = {
        name: '',
        child: [],
    };

    obj["name"] = funName; // save funName

    return obj;
}

function parseLayer(parent, startIndex, layerNumber) {
    const layerMeta = getLayerMeta(startIndex);
    parent.child.push(layerMeta);

    // 同時要找下一層跟這一層還有沒有
    // 找到下一層就不用再找下一層的，只要再找到這一層就好了
    let isFindChild = false;
    // find next
    for(let i = startIndex + layerStrSize; i < fileData.length; i++) {
        const nextStartIndex = fileData.indexOf(layerStr, i);
        const nextLayerNumber = fileData.substring(nextStartIndex + layerStrSize, fileData.indexOf('#', nextStartIndex + layerStrSize + 1));
        
        // has child layer
        if (!isFindChild && (nextStartIndex >= 0) && (Number(nextLayerNumber) > Number(layerNumber))) {
            isFindChild = true;
            // 限制執行層數
            if (nextLayerNumber <= nLayer){
                parseLayer(layerMeta, nextStartIndex, nextLayerNumber);
            }
            
        }
        // has same layer
        else if (nextStartIndex >= 0 && (Number(nextLayerNumber) === Number(layerNumber))) {
            parseLayer(parent, nextStartIndex, nextLayerNumber);
            break;
        }
        // 找到比目前這一層還小，表示已經找到外面去了
        else if (nextStartIndex >= 0 && (Number(nextLayerNumber) < Number(layerNumber))){
            break;
        }

        // 加速
        if (nextStartIndex >= 0) {
            i = nextStartIndex;
        }
        // 找不到
        else {
            break;
        }
    }
}


fileData = fs.readFileSync(`./pp.txt`, { encoding: 'utf8'});

const result = {
    name: 'root',
    child: [],
};

const startIndex = fileData.indexOf(layerStr, 0);
const layerNumber = fileData.substring(startIndex + layerStrSize, fileData.indexOf('#', startIndex + layerStrSize + 1));
if (startIndex >= 0) {
    parseLayer(result, startIndex, layerNumber);
}

const outputFileName = `pp_${startLayer}_${nLayer}Layer.json`;
fs.writeFileSync(outputFileName, JSON.stringify(result["child"], null, 2));