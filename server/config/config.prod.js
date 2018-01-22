module.exports = appInfo => {
  return {
    clientRoot: 'http://mock.fe.jyb.com',
    mongoose: {
      url: 'mongodb://127.0.0.1/api-mock'
    },
    // 发送邮件配置
    transporter: {
      appName: 'DIP',
      host: 'smtp.exmail.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: 'h5tool@jyblife.com',
        pass: 'H5tool123456'
      }
    }
  }
}
