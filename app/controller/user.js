const md5 = require('blueimp-md5')
var nJwt = require('njwt')
const AbstractController = require('./abstract')
const fs = require('fs')
const captcha = require('trek-captcha')
class UserController extends AbstractController {
  async search () {
    const { query = '' } = this.ctx.query
    const users = await this.service.user.find(query).lean()
    this.success(users.map(u => {
      delete u.password
      return u
    }))
  }
  async sentResetPassCode () {
    const { email } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const key = 'password_' + user._id
    const hasCode = this.service.cache.has(key)
    if (hasCode) {
      this.error('请勿重复发送')
    }
    const code = this.service.cache.verifyCodeCache(key, 6)
    const rs = await this.service.email.resetPassword(code, user)
    if (rs && rs.messageId) {
      this.success(true)
    } else {
      this.error('发送验证码失败，请重试')
    }
  }
  async sentResetPassTicket () {
    const { email } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const ticket = this.service.ticket.create(user._id, 'password')
    const rs = await this.service.email.passwordTicket(ticket, user)
    if (rs && rs.messageId) {
      this.success(true)
    } else {
      this.error('发送邮件失败，请重试')
    }
  }
  async resetPasswordByTicket () {
    const { email, password, ticket } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const encode = this.service.ticket.check(ticket, 'password', user._id.toString(), user.modifiedTime)
    if (!encode.success) {
      this.error(encode.msg)
    }
    const rs = await this.service.user.updatePassword(email, password)
    if (!rs) {
      this.error('修改失败', 500)
    }
    this.success(true)
  }
  async resetPassword () {
    const { email, password, verifyCode } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const key = 'password_' + user._id
    const correctCode = this.service.cache.get(key)
    if (correctCode !== verifyCode) {
      this.ctx.logger.info('verifyCode error', `correctCode: ${correctCode}，verifyCode: ${verifyCode}`)
      this.error('验证码错误')
    }
    const rs = await this.service.user.updatePassword(email, password)
    if (!rs) {
      this.error('修改失败', 500)
    }
    this.service.cache.del(key)
    this.success(true)
  }
  async get () {
    const rs = this.service.cookie.getUser()
    if (!rs || !rs._id) {
      this.error({
        code: 401,
        msg: '未登录'
      })
    }
    const user = await this.service.user.getById(rs._id)
    if (!user || user.modifiedTime > new Date(rs.modifiedTime)) {
      this.error({
        code: 401,
        msg: '信息已发生变更，请重新登录'
      })
    }
    this.success(rs)
  }
  async create () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
    if (user) {
      this.error('此邮箱已被注册')
      return null
    }
    console.log(info)
    if (info.token === md5(info.captcha, this.config.md5Key) && info.agree) {
      delete info.token
      delete info.agree
      delete info.checkPassword
      delete info.phoneNumberPrefix
      delete info.captcha

      const rs = await this.service.user.create(info)
      delete rs.password
      this.service.cookie.setUser(rs)
      let result = {status: 200, message: 'success', data: rs}
      this.success(result)
    }
  }
  async login () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
    if (!user) {
      this.error('账号不存在')
    }
    if (user.password !== info.password) {
      this.error('密码错误!')
    }
    delete user.password
    var claims = {
      sub: user,
      iss: 'MINGYUE|zhipengyue',
      permissions: 'read,delet,edit'
    }
    var jwt = nJwt.create(claims, this.config.md5Key)
    var timerStamp = Date.parse(new Date()) + 60 * 1000 * 3 // 10分钟
    var exptime = new Date(timerStamp).toLocaleString()
    jwt.setExpiration(exptime)
    var token = jwt.compact()
    // this.service.cookie.setUser(user)
    this.success({token: token, user: user})
  }
  async regist () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
    if (user) {
      this.error('账号已存在')
    } else {
      const rs = await this.service.user.update(user)
      this.success(rs)
    }
  }
  async captcha () {
    const { token, buffer } = await captcha()
    // fs.createWriteStream('captcha.gif').on('finish', () => console.log(token)).end(buffer)
    let data = { token: md5(token, this.config.md5Key), image: 'data:image/png;base64,' + buffer.toString('base64') }
    this.success(data)
  }
  async update () {
    const user = this.ctx.request.body
    const rs = await this.service.user.update(user)
    if (!rs) {
      this.error({
        code: 500,
        msg: '修改失败'
      })
    }
    delete rs.password
    this.service.cookie.setUser(rs)
    this.success(rs)
  }
  async updatePassword () {
    const { originPassword, password, verifyPassword } = this.ctx.request.body
    if (originPassword.trim() === '' || password.trim() === '' || verifyPassword.trim() === '') {
      this.error('信息不能为空')
    }
    if (password !== verifyPassword) {
      this.error('确认密码不一致')
    }
    console.log(this.ctx.request.body)
    const rs = await this.service.user.updatePasswordByOldPassword(originPassword, password)
    if (!rs) {
      this.error('密码错误')
    }
    delete rs.password
    this.service.cookie.setUser(rs)
    this.success(rs)
  }
  logout () {
    this.service.cookie.clearUser()
    this.success('注销成功')
  }
}

module.exports = UserController
