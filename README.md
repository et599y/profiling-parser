# profiling-parser

## Installation
1. clone the repository
```
git clone https://github.com/et599y/profiling-parser.git
```

2. install packages
```
npm install
```

## Code description
> 執行前須確保資料夾、檔案名稱、parser type 等參數已修改

### Batch processing profiling for CNN model
```
node runpy_patch.js
```

### Batch processing profiling for object detection
```
node runpy_object.js
```

### Parser to json format

- 以 function 的 start & end index 為基準的 parser
```
node main_v1.js
```
> 若出現 RangeError: Invalid string length，把程式中的 JSON.stringify() 後面的 (null, 2) 移除，縮小檔案大小。若檔案依然過大，使用下面方法執行。

- 逐行讀取 txt & parser (沒有檔案大小限制)
```
node main_v2.js
```
> 若出現記憶體不足 error，可自行調整記憶體 space size
```
node --max-old-space-size=7168 main_v2.js
```

### Count the number of diff
- 比較兩個檔案有出現差異的數量
```
node countDiffNum.js
```

### Analytical method (依funcion, time, return value細分)
#### Function

- 統計各 function 呼叫次數
```
node countTotalFunc.js
```
- 以 baseline 計算各檔案總 function 呼叫次數的差值
```
node countTotalFuncMinus.js
```
- 依前兩層統計 function 呼叫次數
```
node countLayerFunc.js
```

#### Cost time
- 統計各 function total cost time
```
node countTotalFuncTime.js
```
- 以 baseline 計算各檔案 function cost time 的差值
```
node countTotalTimeMinus.js
```
- 依前兩層統計 function total cost time
```
node countLayerFuncTime.js
```

#### Return value
- 以 baseline 計算各檔案 different types of return values 的差異距離 (int, float, string, bool)
```
node countOutputDistance.js
```
- 以 baseline 計算各檔案 if return value type 為 matrix
```
node countMatrixDistance.js
```
- 依前兩層統計 return value diff 次數
```
node countLayerOutputDiff.js
```

### Differential Analysis (計算A, B, C 三個 Set)
> 依檔案格式分成兩種寫法，擇其一使用即可
```
node patch_differential_analysis.js
```
```
node object_detection_differential_analysis.js
```