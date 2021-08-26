const fs = require('fs');
const excelToJson = require('convert-excel-to-json');
const fileDir = `LayerOutput` // defin fileDir: LayerFunc, func_all, LayerTime, time_all, LayerOutput, OutputDiff
let temp_Arr = []

function getFileData(filename){
    const result = excelToJson({
        source: fs.readFileSync(`./${fileDir}/${filename}.xlsx`), // 
        header:{
            // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
            rows: 1 // 2, 3, 4, etc.
        },
        columnToKey: {  // define column
            A: 'func',
            B: 'count'
        }
    });

    return result
}

function org_duplicate(){
    let old_Arr = []
    const left = getFileData(`1-1`); // baseline
    for(let i=2;i<=3; i++){
        const right = getFileData(`${i}-1`);
        temp_Arr = [] // 每次清空
        countDiff(left["Sheet 1"], right["Sheet 1"])
        if(old_Arr == ""){
            old_Arr = temp_Arr
        }else{
            const result = temp_Arr.filter(w => old_Arr.includes(w)); // 只取共同出現的func name
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return [...new Set(old_Arr)] // 避免重複值出現
}

function adv_duplicate() {
    let old_Arr = []
    const left = getFileData(`1-2`) // baseline
    for (let i = 2; i <= 3; i++) {
        const right = getFileData(`${i}-2`);
        temp_Arr = [] // 每次清空
        countDiff(left["Sheet 1"], right["Sheet 1"])
        if (old_Arr == "") {
            old_Arr = temp_Arr
        } else {
            const result = temp_Arr.filter(w => old_Arr.includes(w)) // 只取共同出現的func name
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return [...new Set(old_Arr)] // 避免重複值出現
}

function org_and_adv_duplicate(){
    let old_Arr = []
    for(let i=1;i<=3; i++){
        const left = getFileData(`${i}-1`); // org
        const right = getFileData(`${i}-2`); //adv
        temp_Arr = [] // 每次清空
        countDiff(left["Sheet 1"], right["Sheet 1"])
        if(old_Arr == ""){
            old_Arr = temp_Arr
        }else{
            const result = temp_Arr.filter(w => old_Arr.includes(w)); // 只取共同出現的func name
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return [...new Set(old_Arr)] // 避免重複值出現
}

function countDiff(left, right) {
    for (i=0;i<left.length;i++){
        if(right[i]){
            if(left[i].count != right[i].count){
                temp_Arr.push(left[i].func)
            }
        }
    }
}

const A = org_and_adv_duplicate()
console.log(A)
console.log('A Length: ' + A.length)
const B = org_duplicate()
console.log(B)
console.log('B Length: ' + B.length)
const C = adv_duplicate()
console.log(C)
console.log('C Length: ' + C.length)

if (A.length == 0) {
    console.log('No diff between org and adv')
}
else {
    let A_or = A.filter(w => !B.includes(w))
    A_or = A_or.filter(w => !C.includes(w))
    console.log("A' Length: " + A_or.length)
    if (A_or.length == 0) {
        console.log('No identifiable difference')
    } else {
        console.log(`Use ${A_or.toString().replace(/name,/g, 'name,\n')} as rule`)
    }
}
