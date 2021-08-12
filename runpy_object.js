// 執行python code & 側錄
var exec = require('child_process').exec;
var fs = require('fs');

(async function () {
    const dir = fs.readdirSync(`C:\\Users\\sosclubnccu\\Desktop\\models\\research\\object_detection\\test_images\\testSet2\\`)
    for(let i=0; i< dir.length; i++){
        const file = dir[i]
        console.log(file)
        await execCmd(file.split('.')[0]);
    }
})();

async function execCmd(img) {
    return new Promise((resolve, rejects) => {
        exec(`python robust_physical_attack.py ${img}.jpg testSet2/${img}.txt` , {cwd:"C:\\Users\\sosclubnccu\\Desktop\\models\\research\\object_detection"}, function (error, stdout) { // stdout為python端回傳值
            if(error) throw error;
            // console.log('receive: ' + stdout);
            resolve();
        });
    }) 
}