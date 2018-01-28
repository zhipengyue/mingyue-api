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
    }else{
      this.error()
    }
  }
  async delete () {
    var departments = this.ctx.request.body
    let departmentIds=[]
    for(let i=0;i<departments.length;i++){
      let departmentId=departments[i].departmentId
      departmentIds.push(departmentId)
    }
    const getlist = await this.service.department.getByIds(departmentIds)
    if(getlist.length>0){
      let departmentIds=[]
      for(let i=0;i<getlist.length;i++){
        let departmentId=getlist[i].departmentId
        departmentIds.push(departmentId)
      }
      const deleteResult = await this.service.department.deleteByIds(departmentIds)
      console.log(deleteResult)
      if(deleteResult.affectedRows>0){
        this.success({'status':200,message:deleteResult.message})
      }else{
        this.error()
      }

    }else{
      this.error()
    }
    // if (exist) {
    //   var children=[];
    //   children=this.treeToArray(department)
    //   console.log(children)
    // }else{
    //   this.error('err')
    // }
  }
}

module.exports = DepartmentController
