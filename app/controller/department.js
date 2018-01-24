const AbstractController = require('./abstract')

class DepartmentController extends AbstractController {
  async getlist () {
    const rs = await this.service.department.getlist()
    this.success(rs)
  }
  async add () {
    var department = this.ctx.request.body
    const exist = await this.service.department.getByName(department.departmentName)
    if (exist) {
      this.error('部门已存在')
    } else {
      const rs = await this.service.department.create(department)
      const updateSuccess = rs.affectedRows === 1;
      if(updateSuccess){
        this.success(rs)
      }else{
        this.error()
      }
    }
  }
  async edit () {
    var department = this.ctx.request.body
    const exist = await this.service.department.getById(department.departmentId)
    if (exist) {
      
      const rs = await this.service.department.update(department)
      const updateSuccess = rs.affectedRows === 1;
      if(updateSuccess){
        this.success(rs)
      }else{
        console.log(rs)
        this.error()
      }
    }
  }
}

module.exports = DepartmentController
