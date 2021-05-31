// 整理前兩層的total func count
const fs = require('fs');
let json2xls = require('json2xls');
let temp = []
let num = 0
const fileDir = '0507_json_func' // change file dir

fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    // if(fileName.includes('Xception')){
        let totaljson = []
        console.log(fileName)
        fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
        for (let i = 0; i < fileData.length; i++) {  
            temp = [{ name: fileData[i].name, count: 1}] // 第一層
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
        
            // // 計算第一層數量
            // for(let p=1; p < temp.length; p++){
            //     temp[0].count += temp[p].count; //所有第二層加總等於第一層數量
            // }
            // console.log(temp)
            totaljson = totaljson.concat(temp);
            fs.writeFileSync(`./${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
        }
    // }
});

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