module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '500kb' // 不能再大了，再大接口实在太不合理了
    },
    mongoose: {
      url: 'mongodb://127.0.0.1/api-mock',
      options: {}
    },
    mysql: {
      // database configuration
      client: {
        // host
        host: 'localhost',
        // port
        port: '3306',
        // username
        user: 'root',
        // password
        password: 'root',
        // database
        database: 'mingyue'
      },
      // load into app, default is open
      app: true,
      // load into agent, default is close
      agent: false
    },
    // cookie 加密的keys
    keys: 'MINGYUE_2018',//`${appInfo.name}_{{cookie_secret_key}}`,
    // 密码加密的key
    md5Key: 'MINGYUE_2018',
    // 允许跨域携带cookie
    cors: {
      credentials: true
    },
    middleware: [ 'auth' ],
    // 邮件推送间隔
    pushInterval: {
      // 一个小时内修改api不会连续推送
      api: 1000 * 60 * 60
    },
    // 发送邮件配置
    transporter: {
      appName: 'Api Mocker',
      host: 'smtp.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: '{{email_address}}',
        pass: '{{email_password}}'
      }
    },
    jwt: {
      secret: 'MINGYUE_TK',
      enable: true, // default is false
      match: '/success' // optional
    },
    security: {
      csrf: {
        headerName: 'x-csrf-token' // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      }
    }
  }
  return config
}
