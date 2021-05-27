// 計算所有出現function次數
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var fs = require('fs'),
    readline = require('readline');
const { resolve } = require('path');
const output_type = 'function'

let funcArr = [];
const fileDir = '0507_json_func' // input file dir 

async function auto_count(){
    const files = fs.readdirSync(`./${fileDir}/`);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.split('.')[0];
        funcArr = []
        let delta = `./${fileDir}/${file}`;
        console.log(fileName)
        await countFunc(delta, fileName)
    }
    // const category = ['bike', 'cat', 'car', 'dog', 'flag']
    // const model = ['VGG16', 'VGG19', 'Resnet50', 'Inceptionv3', 'Xception']
    // for(let i=0; i<category.length; i++){
    //     // original
    //     for(let j=0; j< model.length; j++){
    //         funcArr = []
    //         let delta = `./1215_json_${output_type}/${category[i]}_patch_${model[j]}.json`;
    //         console.log(category[i], model[j])
    //         await countFunc(delta, `${category[i]}_patch_${model[j]}_func`)
    //     }

    //     // adversarial
    //     for(let j=0; j< model.length; j++){
    //         funcArr = []
    //         let delta = `./1215_json_${output_type}/${category[i]}_patch_${model[j]}_${model[j]}.json`;
    //         console.log(category[i], model[j])
    //         await countFunc(delta, `${category[i]}_patch_${model[j]}_${model[j]}_func`)
    //     }
    // }
}
auto_count()

// count funcv
function countFunc(path, outputname){
    var rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout
        // console: false
    });

    return new Promise(resolve =>{
        rd.on('line', function (line) {
            if(line.includes('name')){
                const start = line.indexOf('name') + 8
                const end = line.indexOf('"', start)
                funcArr.push(line.substring(start, end))
            }
        })
        .on('close', function(){  
            fs.writeFileSync(`./func_call_object/${outputname}.json`, JSON.stringify(getFrequency(funcArr), null, 2))
            resolve()
        });
    });
}

function getFrequency(arr) {
    var freq = {};
    for (var i=0; i<arr.length;i++) {
        if (freq[arr[i]]) {
           freq[arr[i]]++;
        } else {
           freq[arr[i]] = 1;
        }
    }

    return freq;
};


// function auto_compare(){
//     const category = ['bike', 'cat', 'car', 'dog', 'flag']
//     const model = ['VGG16', 'VGG19', 'Resnet50', 'Inceptionv3', 'Xception']
//     for(let i=0; i<category.length; i++){
//         for(let j=0; j<model.length; j++){      

//             console.log(category[i], model[j])
//             let left = JSON.parse(fs.readFileSync(`./func_call/${category[i]}_patch_${model[j]}_func.json`));
//             let right = JSON.parse(fs.readFileSync(`./func_call/${category[i]}_patch_${model[j]}_${model[j]}_func.json`));
//             compare(left, right)
//         }
//     }
// }

// function compare(l, r){ 
//     let temp_l = {}
//     let temp_r = {}
//     let l_ary = Object.keys(l)
//     let r_ary = Object.keys(r)
//     // 以左邊為主一個一個看
//     for(let i=0; i<l_ary.length; i++){
//         let key = l_ary[i]
//         // if右邊找不到一樣或值不一樣
//         if(r_ary.find(x => x == key) == null || l[key] != r[key]){
//             temp_r[key] = r[key]
//             temp_l[key] = l[key]
//             if(r[key] == undefined) temp_r[key] = 0
//         }
//     }
//     // 以右邊為主再看一次
//     for(let j=0; j<r_ary.length; j++){
//         let key = r_ary[j]
        
//         if(r[key] != l[key] && Object.keys(temp_l).find(x => x == key) == null){
//             temp_r[key] = r[key]
//             temp_l[key] = 0
//         }
//     }

//     if(Object.keys(temp_l).length == 0 && Object.keys(temp_r).length == 0){
//         console.log('SAME!')
//     }else{
//         console.log(temp_l)
//         console.log(temp_r)
//     }
// }

// let left = JSON.parse(fs.readFileSync(`./func_call/bike_patch_VGG16_func.json`));
// let right = JSON.parse(fs.readFileSync(`./func_call/bike_patch_VGG16_VGG16_func.json`));
// compare(left, right)