// 計算total function time 數量 以arg_cat為baseline 算差值
var fs = require('fs')
let json2xls = require('json2xls');
org_cat = JSON.parse(fs.readFileSync(`./func_time_object/org_1.json`));
let sortable = org_cat.slice(0,50)
console.log(sortable) // 取前50個

fs.readdirSync('./func_time_object/').forEach(file => {
    const fileName = file.split('.')[0];
    // if(fileName.includes('Xception')){
        let totaljson = []
        console.log(fileName)
        fileData = JSON.parse(fs.readFileSync(`./func_time_object/${fileName}.json`));
        let temp = []
        for(let i=0; i < sortable.length; i++){ 
            let funcName = sortable[i].name
            let objIndex = fileData.findIndex(element => element.name == funcName)
            // console.log(parseInt(fileData[objIndex].time), )
            temp.push({name: funcName, value: parseInt(fileData[objIndex].time) - sortable[i].time})
        }
        // console.log(temp)
        totaljson = totaljson.concat(temp);
        fs.writeFileSync(`./${fileName}.xlsx`, json2xls(totaljson), 'binary'); // 結果存為excel 
    // }
});