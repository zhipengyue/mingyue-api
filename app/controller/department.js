const AbstractController = require('./abstract')

class DepartmentController extends AbstractController {
  async getlist () {
    const rs = await this.service.department.getlist()
    this.success(rs)
  }
  async add () {
    var department = this.ctx.request.body
    let parentId=null;
    if(department['parentId']){
      parentId = department['parentId']
      delete department.parentId
      //this.service.department.setChild(parentId)
    }

    const exist = await this.service.department.getByName(department.departmentName)
    if (exist) {
      this.error('部门已存在')
    } else {
      const rs = await this.service.department.create(department)
      const createdDepartment = await this.service.department.getByName(department.departmentName)
      const childId=createdDepartment.departmentId
      if(parentId){
        const setchild = await this.service.department.setChild(parentId,childId)
        const updateSuccess = setchild.affectedRows === 1;
        if(updateSuccess){
          this.success('设置成功')
        }else{
          this.error('设置子部门错误')
        }
      }
      this.success(rs)
    }
  }
}

module.exports = DepartmentController
