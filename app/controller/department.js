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
    const exist = await this.service.department.getById(department.departmentId)
    if (exist) {
      var children=[];
      children=this.treeToArray(department)
      console.log(children)
    }else{
      this.error('err')
    }
  }
  treeToArray(tree){
    var arr=[]
    if(tree.children&&tree.children.length>0){
      for(let i=0;i<tree.children.length;i++){
        var child=tree.children[i]
        arr.push(...this.treeToArray(child))
      }
    }
    arr.push(tree)
    return arr
  }
}

module.exports = DepartmentController
