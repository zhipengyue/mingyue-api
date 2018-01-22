const AbstractController = require('./abstract')

class DepartmentController extends AbstractController {
  async getlist () {
    const rs = await this.service.department.getlist()
    this.success(rs)
  }
  async add () {
    const department = this.ctx.request.body
    console.log(department)
    const exist = await this.service.department.getByName(department.departmentName)
    console.log(exist === '')
    if (exist) {
      this.error('部门已存在')
    } else {
      const rs = await this.service.department.create(department)
      this.success(rs)
    }
  }
}

module.exports = DepartmentController
