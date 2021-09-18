const fs = require('fs')
const profiler = require('v8-profiler-node8')

profiler.startProfiling('', true)

setTimeout(function() {
    // 引入分词模块
const Segment = require('segment')
const segment = new Segment()
// 载入默认词典
segment.useDefault()
// 载入字典
segment.use('URLTokenizer');
segment.loadDict('dict.txt')
    .loadDict('dict2.txt') // 扩展词典（用于调整原盘古词典）
    .loadDict('names.txt') // 常见名词、人名
    .loadDict('wildcard.txt', 'WILDCARD', true) // 通配符
    .loadSynonymDict('synonym.txt') // 同义词
    .loadStopwordDict('stopword.txt') // 停止符

const fs = require('fs')

fs.readdir('./test', (err, data) => {
    fs.readFile('./test/' + data[0], (err, d1) => {
        // console.log(d1.toString())
        for(let i = 1; i < data.length; i++) {
            fs.readFile('./test/' + data[i], (err, d2) => {
                let data1 = d1.toString().replace(/\s+/g, "").replace(/[\r\n]/g, "")
                let data2 = d2.toString().replace(/\s+/g, "").replace(/[\r\n]/g, "")
                console.log(handle(data1, data2))
            })
        }
    })
})

let arr1 = '今天是星期天，天气晴，今天晚上我要去看电影'

let arr2 = '今天是周天，天气晴朗，我晚上要去看电影'

console.log(handle(arr1, arr2))

function handle(data1, data2) {
    let arr1 = segment.doSegment(data1, {
        stripPunctuation: true,
        simple: true
    })

    let arr2 = segment.doSegment(data2, {
        stripPunctuation: true,
        simple: true
    })

    let arr = []
    let res1 = []
    let res2 = []

    for (let i = 0; i < arr1.length; i++) {
        if (arr.indexOf(arr1[i]) === -1) {
            arr.push(arr1[i])
        }
    }

    for (let i = 0; i < arr2.length; i++) {
        if (arr.indexOf(arr2[i]) === -1) {
            arr.push(arr2[i])
        }
    }

    for (let i = 0; i < arr.length; i++) {
        res1[i] = 0
        res2[i] = 0
        for (let j = 0; j < arr1.length; j++) {
            if (arr[i] === arr1[j]) {
                res1[i]++
            }
        }

        for (let k = 0; k < arr1.length; k++) {
            if (arr[i] === arr2[k]) {
                res2[i]++
            }
        }
    }

    let top = 0
    let bottom1 = 0
    let bottom2 = 0

    for (let i = 0; i < arr.length; i++) {
        top += res1[i] * res2[i]
        bottom1 += res1[i] * res1[i]
        bottom2 += res2[i] * res2[i]
    }

    let res = top / (Math.sqrt(bottom1) * Math.sqrt(bottom2))

    return res
}
    profiler.stopProfiling('')
        .export()
        .pipe(fs.createWriteStream('res.json'))
}, 1000)