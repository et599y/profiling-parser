const fs = require('fs');
const jsondiffpatch = require('jsondiffpatch');
const output_type = "func" // define 分析的類別: func return time arg
const model_name = "VGG16" // define model class: VGG16 VGG19 Resnet50 Inceptionv3 Xception
const fileDir = `0225_json_${output_type}_new`
let old_Arr = []
let temp_Arr = []

function org_duplicate(){
    const category = ['bike', 'car', 'dog', 'flag']
    const left = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/cat_patch_${model_name}.json`)); // baseline
    for(let i=0;i<category.length; i++){
        const right = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/${category[i]}_patch_${model_name}.json`));
        const delta = jsondiffpatch.diff(left, right);
        temp_Arr = [] // 每次清空
        diffList_to_index(delta, "", ",")
        console.log(temp_Arr.length)
        if(old_Arr == ""){
            old_Arr = temp_Arr
        }else{
            const result = temp_Arr.filter(w => old_Arr.includes(w));
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
}

function adv_duplicate(){
    const category = ['bike', 'car', 'dog', 'flag']
    const left = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/cat_patch_${model_name}_${model_name}.json`)); // baseline
    for(let i=0;i<category.length; i++){
        const right = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/${category[i]}_patch_${model_name}_${model_name}.json`));
        const delta = jsondiffpatch.diff(left, right);
        temp_Arr = [] // 每次清空
        diffList_to_index(delta, "", ",")
        console.log(temp_Arr.length)
        if(old_Arr == ""){
            old_Arr = temp_Arr
        }else{
            const result = temp_Arr.filter(w => old_Arr.includes(w));
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
}

function org_and_adv_duplicate(){
    const category = ['cat', 'bike', 'car', 'dog', 'flag']
    for(let i=0;i<category.length; i++){
        const left = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/${category[i]}_patch_${model_name}.json`)); // org
        const right = JSON.parse(fs.readFileSync(`./0225_json_${output_type}_new/${category[i]}_patch_${model_name}_${model_name}.json`)); //adv
        const delta = jsondiffpatch.diff(left, right);
        temp_Arr = [] // 每次清空
        diffList_to_index(delta, "", ",")
        console.log(temp_Arr.length)
        if(old_Arr == ""){
            old_Arr = temp_Arr
        }else{
            const result = temp_Arr.filter(w => old_Arr.includes(w));
            old_Arr.length = 0 // 清空
            old_Arr = result
        }
    }
    return old_Arr
}

function diffList_to_index(data, key, sign) {
    if (key == "" || key == undefined) {
        key = "json"
    }
    for (p in data) {
        var k = key + sign + p
        if (Array.isArray(data[p])) {
            let diff = "";
            // modify
            if(p == 'name' || p == output_type){
                diff = k.slice(5,) + ',' + data[p][0] + '&' + data[p][1]
            }   
            // insert
            else if( parseInt(p) || p == "0"){
                diff = k.slice(5,) + ",name," + data[p][0].name
            }
            // move or remove
            else{
                const index = p.slice(1,);
                diff = key.slice(5,) + "," + index + ",name," + data[p][0].name
            }

            temp_Arr.push(diff)
        }
        else if(data[p] instanceof Object) {
            diffList_to_index(data[p], k, sign)    //如果是Object則遞迴
        } 
    }
}


const A = org_duplicate()
console.log('A Length: ' + A.length)
const B = adv_duplicate()
console.log('B Length: ' + B.length)
const C = org_and_adv_duplicate()
console.log('C Length: ' + C.length)

if (C == ""){
    console.log('No diff between org and adv')
}
else{
    let C_or = C.filter(w => !A.includes(w))
    C_or = C_or.filter(w => !B.includes(w))
    console.log(C_or.length)
    if(C_or == ""){
        console.log('No identifiable difference')
    }else{
        console.log(`Use ${C_or.toString().replace(/name,/g, 'name,\n')} as rule`)
    }
}
