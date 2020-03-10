const FileManager = require("./file-manager")

class PathResolver {
  // 根据配置文件替换路径
  resolveDistPath(sourcePath, outputPattern) {
    const fileNamePattern = /([^\/]+)\.md$/g
    const fileInfo = fileNamePattern.exec(sourcePath)
    const fileName = fileInfo ? fileInfo[1] : "index"
    return outputPattern.dir + outputPattern.filename.replace("[name]", fileName)
  }
}

module.exports = (api, projectOptions) => {
  const configPath = `${process.cwd()}/md.config.js`
  const getConfig = () => {
    return require(configPath)
  }

  const fileManager = new FileManager()
  const pathResolver = new PathResolver()

  api.registerCommand("md2html", args => {
    const config = getConfig()

    fileManager.getFiles(config.src).then(files => {
      return fileManager
        .readFileContents(files)
        .then(contents => {
          return fileManager.convert2Html(contents)
        })
        .then(htmls => {
          return fileManager.html2Component(htmls)
        })
        .then(contents => {
          return files.map((filePath, index) => ({
            path: pathResolver.resolveDistPath(filePath, config.output),
            content: contents[index]
          }))
        })
        .then(components => {
          return fileManager.writeFile2Disk(components, config.output.dir)
        })
    })
  })
}
