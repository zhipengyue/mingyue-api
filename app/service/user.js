const Service = require('egg').Service
const md5 = require('blueimp-md5')

class UserService extends Service {
  async create (user) {
    // return (await this.ctx.model.User({
    //   email: user.email,
    //   password: md5(user.password, this.config.md5Key),
    //   name: user.name
    // }).save()).toObject()
    user.password = md5(user.password, this.config.md5Key)
    var timestamp = Date.parse(new Date())
    user.userId = 'user_' + timestamp
    user.createTime = new Date()
    await this.app.mysql.insert('userList', user)
    return { status: 200, data: null, message: 'success!' }
  }
  async getByEmail (email) {
    // return this.ctx.model.User.findOne({
    //   email
    // }).lean()
    const user = await this.app.mysql.get('userList', { email: email })
    return user
  }
  async getById (id) {
    // return this.ctx.model.User.findOne({
    //   _id: id
    // })
    const user = await this.app.mysql.get('userList', { userId: id })
    return user
  }
  getByIds (ids) {
    return this.ctx.model.User.find({
      _id: {
        $in: ids
      }
    })
  }
  find (q) {
    const reg = new RegExp(`.*${q}.*`, 'i')
    return this.ctx.model.User.find({
      isDeleted: false,
      $or: [
        { name: reg },
        { email: reg }
      ]
    })
  }
  updatePassword (email, password) {
    return this.ctx.model.User.findOneAndUpdate({
      email
    }, {
      password: md5(password, this.config.md5Key),
      modifiedTime: new Date()
    }, { new: true }).lean()
  }
  updatePasswordByOldPassword (oldPassword, newPassword) {
    return this.ctx.model.User.findOneAndUpdate({
      _id: this.ctx.authUser._id,
      password: md5(oldPassword, this.config.md5Key)
    }, {
      password: md5(newPassword, this.config.md5Key),
      modifiedTime: new Date()
    }, { new: true }).lean()
  }
  async update (user) {
    const rs=await this.app.mysql.update('userList',user)
    return rs
  }
}

module.exports = UserService
