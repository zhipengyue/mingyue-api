const md5 = require('blueimp-md5')
var nJwt = require('njwt')
const AbstractController = require('./abstract')
const fs = require('fs')
const captcha = require('trek-captcha')
class StaffController extends AbstractController {
  async create () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
    if (user) {
      this.error('此邮箱已被注册')
      return null
    }
    console.log(info)
    info.password=md5('123456', this.config.md5Key)
      const rs = await this.service.user.create(info)
      delete rs.password
      //this.service.cookie.setUser(rs)
      //let result = {status: 200, message: 'success', data: rs}
      this.success(rs)
  }
}

module.exports = StaffController
