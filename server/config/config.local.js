module.exports = appInfo => {
  return {
    mongoose: {
      url: 'mongodb://127.0.0.1:27017/dipyunjia'
      // url: 'mongodb://localhost:27019/dip'
    },
    clientRoot: 'http://localhost:8080'
  }
}
