// 依前兩層的func name，擷取該fun第三層以下的data
const fs = require('fs');
const funcLayer1 = 'plot_detections()' // 第一層 function name
const funcLayer2 = 'visualize_boxes_and_labels_on_image_array()' // 第二層 function name

// 找出區塊的data
function getNewData(fileData){
    for(let i=0;i<fileData.length; i++){
        if(fileData[i].name == funcLayer1){
            for(let j=0;j<fileData[i].child.length; j++){
                if(fileData[i].child[j].name == funcLayer2){
                    return fileData[i].child[j].child
                    // console.log(fileData[i].child[j].child)
                }
            }
        }
    }
}

const dirName = '0628_json_func_test' // folder name 
const newFolderName = `${dirName}_Layer3` // define new folder name
// 建立資料夾
if (!fs.existsSync(`./${newFolderName}`)) {
    fs.mkdirSync(`./${newFolderName}`)
}

fs.readdirSync(`./${dirName}/`).forEach(file => {
    let fileData = JSON.parse(fs.readFileSync(`./${dirName}/${file}`));
    const newData = getNewData(fileData)
    console.log(newData)
    fs.writeFileSync(`./${newFolderName}/${file}`, JSON.stringify(newData, null, 2)); // save file
});