const feMonitor = {
  notify (err, info) {
    console.log("我监控到了错误: ", err)
    console.log("信息: ", info)
  }
}

module.exports = feMonitor