// 統整前兩層的total func call
const fs = require('fs');
let json2xls = require('json2xls');
let temp = []
let num = 0
const fileDir = '0628_json_func' // file folder
const outputDir = 'LayerFunc'

fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    let totaljson = []
    console.log(fileName)
    fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
    for (let i = 0; i < fileData.length; i++) {  
        temp = [{ name: '1 '+fileData[i].name, count: 1}] // 第一層，name裡面的1是用來標註該function是第一層
        fileData[i].child.forEach(element => {             // 第二層
            let funcName = element.name
            if (element.child.length == 0){ 
                tempCheck(funcName, 1)
            } else {
                num = 1
                countFunc(element.child)
                tempCheck(funcName, num)
            }
        });
    
        totaljson = totaljson.concat(temp);
        // 建立資料夾
        if (!fs.existsSync(`./${outputDir}`)) {
            fs.mkdirSync(`./${outputDir}`)
        }
        fs.writeFileSync(`./${outputDir}/${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
    }
});

// 同 func 累加
function tempCheck(func, c){
    let check = false
    temp.forEach(x=>{
        if(x.name == func){
            check = true
            x.count += c
            return false;
        }
    });
    if(check == false) temp.push({ name: func, count: c})
}

function countFunc(data){
    // 判斷array size是否為空
    if(data.length > 0){
        for(let i=0; i < data.length; i++){
            num += 1
            countFunc(data[i].child)
        }
    }
}