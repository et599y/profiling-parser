// 計算兩個檔案的diff數量
const fs = require('fs');
const jsondiffpatch = require('jsondiffpatch');
const fileDir = '0507_json_return_Layer3'
let count_diff = 0;
let a=0,b=0,c=0;

const left = JSON.parse(fs.readFileSync(`./${fileDir}/org_3.json`)); // 帶入欲比較檔案名稱1
const right = JSON.parse(fs.readFileSync(`./${fileDir}/org_2.json`)); // 帶入欲比較檔案名稱2
const delta = jsondiffpatch.diff(left, right);
fs.writeFileSync('./delta.json', JSON.stringify(delta, null, 2)); // diff list 存起來
printValue_update(delta, "", ",")
console.log(count_diff) // total diff num
console.log(a,b,c) // 不同型別的diff num



function printValue_update(data, key, sign) {
        if (key == "" || key == undefined) {
            key = "json"
        }
        for (p in data) {
            var k = key + sign + p
            if (Array.isArray(data[p])) {
                console.log(...data[p])
                let diff = "";
                let func_name = "";
                // modify
                if(p == 'name'){
                    count_diff += 1
                    a ++
                    // diff = k.slice(5,) + " = " + data[p][0] + "&" + data[p][1]
                    // func_name = data[p][0]
                }   
                // insert
                else if( parseInt(p) || p == "0"){
                    count_diff += 1
                    b ++
                    // diff = k.slice(5,) + ",name = " + data[p][0].name
                    // functionArr.push(data[p][0].name)
                } 
                // remove or move  
                else{
                    count_diff += 1
                    c ++
                }    

            }
            else if(data[p] instanceof Object) {
                printValue_update(data[p], k, sign)    //如果是Object則遞迴
            } 
        }
}


