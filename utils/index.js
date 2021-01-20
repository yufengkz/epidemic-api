import fs from 'fs'
import path from 'path'

//读取文件
const readFile = async url => {
    try {
        let data = await fs.readFileSync(path.resolve(__dirname, '..' + url), 'utf-8')
        if (data) return JSON.parse(data)
    } catch (err) {
        // 出错了
        console.log('%c 🌽 err: ', ' ', err)
    }
}

export { readFile }
