// 執行python code & 側錄
var exec = require('child_process').exec;
var fs = require('fs');
const img_name = ["bike", "car", "cat", "dog", "flag"];
const model_name = ["VGG16", "VGG19", "Xception", "Inceptionv3", "Resnet50"];

(async function () {
    for(let x=0;x < model_name.length; x++){
        // original
        for(let i=0; i < img_name.length; i++){
            await execCmd(model_name[x], img_name[i], `${img_name[i]}_patch_${model_name[x]}`);
        }

        // adversarial
        for(let i=0; i < img_name.length; i++){
            await execCmd(model_name[x], img_name[i] + `_${model_name[x]}`, `${img_name[i]}_patch_${model_name[x]}_${model_name[x]}`);
        }
    }
    
})();

async function execCmd(model_, img, output_path) {
    return new Promise((resolve, rejects) => {
        exec(`C:\\Users\\sosclubnccu\\AppData\\Local\\Programs\\Python\\Python35\\python.exe ${model_}/${model_}.py ${model_}/${img}.jpg ${output_path}.txt` , function (error, stdout) { // stdout為python端回傳值
            if(error) throw error;
            // console.log('receive: ' + stdout);
            resolve();
        });
    }) 
}