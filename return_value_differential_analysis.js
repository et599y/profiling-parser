const fs = require('fs');
const output_type = "return" // define 分析的類別: func return time
const fileDir = `0628_json_${output_type}_test_Layer3`
let temp = []
let temp_Arr = []

// 統計func's return value diff
function countDiff(fileData, fileData2) {
    temp = []
    countFunc(fileData, fileData2)
    return temp
}

// 同 func 累加
function tempCheck(func) {
    let check = false
    temp.forEach(x => {
        if (x.name == func) {
            check = true
            x.count += 1
            return false;
        }
    });
    if (check == false) temp.push({ name: func, count: 1 })
}

function countFunc(benchmark, data) {
    // 判斷array size是否為空
    if (benchmark.length > 0) {
        // console.log('aaa', benchmark, data)
        for (let i = 0; i < benchmark.length; i++) {
            if(data[i]){
                if(benchmark[i].name == data[i].name && benchmark[i].return != data[i].return){
                    tempCheck(benchmark[i].name)
                }
                countFunc(benchmark[i].child, data[i].child)
            }   
        }
    }
}

function org_and_adv_duplicate() {
    let old_Arr = []
    for (let i = 1; i < 3; i++) {
        let left = JSON.parse(fs.readFileSync(`./${fileDir}/${i}-2.json`)); // org
        let right = JSON.parse(fs.readFileSync(`./${fileDir}/${i}-1.json`)); //adv
        let results = countDiff(left, right)
        
        // results func name 存成 temp_Arr
        temp_Arr = [] // 每次清空
        results.forEach(fun => {
            temp_Arr.push(fun.name)
        })

        // 只取每組data皆有出現差異的func name 
        if (old_Arr == "") {
            old_Arr = temp_Arr
        } else {
            const result = temp_Arr.filter(w => old_Arr.includes(w));
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
}

function org_duplicate() {
    let old_Arr = []
    const left = JSON.parse(fs.readFileSync(`./${fileDir}/1-2.json`)); // baseline
    for (let i = 2; i <= 3; i++) {
        const right = JSON.parse(fs.readFileSync(`./${fileDir}/${i}-2.json`));
        let results = countDiff(left, right)

        // results func name 存成 temp_Arr
        temp_Arr = [] // 每次清空
        results.forEach(fun => {
            temp_Arr.push(fun.name)
        })

        if (old_Arr == "") {
            old_Arr = temp_Arr
        } else {
            const result = temp_Arr.filter(w => old_Arr.includes(w));
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
}

function adv_duplicate() {
    let old_Arr = []
    const left = JSON.parse(fs.readFileSync(`./${fileDir}/1-1.json`)) // baseline
    for (let i = 2; i <= 3; i++) {
        const right = JSON.parse(fs.readFileSync(`./${fileDir}/${i}-1.json`))
        let results = countDiff(left, right)

        // results func name 存成 temp_Arr
        temp_Arr = [] // 每次清空
        results.forEach(fun => {
            temp_Arr.push(fun.name)
        })

        if (old_Arr == "") {
            old_Arr = temp_Arr
        } else {
            const result = temp_Arr.filter(w => old_Arr.includes(w))
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
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
    console.log(A_or.length)
    if (A_or.length == 0) {
        console.log('No identifiable difference')
    } else {
        console.log(`Use ${A_or.toString().replace(/name,/g, 'name,\n')} as rule`)
    }
}
