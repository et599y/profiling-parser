// 統整前兩層的total cost time
const fs = require('fs');
let json2xls = require('json2xls');

const fileDir = '0507_json_time' // change file dir

fs.readdirSync(`./${fileDir}/`).forEach(file => {
    const fileName = file.split('.')[0];
    // if(fileName.includes('Xception')){
        let totaljson = []
        console.log(fileName)
        fileData = JSON.parse(fs.readFileSync(`./${fileDir}/${fileName}.json`));
        for(let i=0; i < fileData.length; i++){  
            let temp = [{'name':fileData[i].name, 'time':fileData[i].time}]
            fileData[i].child.forEach(element => { 
                let check = false
                let funcName = element.name
                temp.forEach(x=>{
                    if(x.name == funcName){
                        check = true
                        x.time += element.time
                        return false;
                    }
                })
                if(check == false) temp.push({'name':funcName, 'time': element.time})
            });
            // 計算第二層總時間
            for(let p=1; p < temp.length; p++){
                temp[0].time -= temp[p].time; //第一層時間減掉所有第二層時間
            }
            // console.log(temp) 
            totaljson = totaljson.concat(temp);
            fs.writeFileSync(`./${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
        }
    // }
});
