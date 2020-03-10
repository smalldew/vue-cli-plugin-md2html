const glob = require("glob")
const fs = require("fs-extra")
const showdown = require("showdown")
const Converter = require("./converter")

// 文件管理器
module.exports = class FileManager {
  constructor() {
    this.converter = new Converter()
  }
  // 获取所有文件
  getFiles(dir) {
    return new Promise((resolve, reject) => {
      glob(dir, {}, function(err, files) {
        resolve(files)
      })
    })
  }
  // 读取文件内容输出内容数组
  readFileContents(files) {
    const fileTaskes = files.map(file => {
      return fs.readFile(file, "utf-8")
    })
    return Promise.all(fileTaskes)
  }
  // 将md数组转换成html
  convert2Html(contents) {
    return contents.map(content => {
      const mdConvert = new showdown.Converter()
      return mdConvert.makeHtml(content)
    })
  }
  // 将html转换成vue组件
  html2Component(htmls) {
    return htmls.map(html => {
      return this.converter.createVue(html)
    })
  }
  // 读取文件内容
  writeFile2Disk(filetree, baseDir) {
    const filesTasks = filetree.map(({path, content}) => {
      return fs.ensureDir(baseDir).then(() => {
        return fs.writeFile(path, content, 'utf-8')
      })
    })
    return Promise.all([filesTasks])
  }
}
