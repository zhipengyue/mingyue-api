const Service = require('egg').Service

class DepartmentService extends Service {
  async getlist () {
    const departments = await this.app.mysql.select('departments')
    if (departments === '') {
      return { status: 200, data: [], message: 'success!' }
    } else {
      return { status: 200, data: departments, message: 'success!' }
    }
  }
  async getByName (name) {
    const department = await this.app.mysql.get('departments', { departmentName: name })
    return department
  }
  async getById (id) {
    const department = await this.app.mysql.get('departments', { departmentId: id })
    return department
  }
  async setChild (parentId,childId) {
    const department=await this.getById(parentId)
    var children=department.children
    if(children){
      children=JSON.parse(children)
      children.push(childId)
    }else{
      children=[]
      children.push(childId)
    }
    children=JSON.stringify(children)
    // department.children=children
    const row = {
      id: department.Id,
      children: children
    };
    const rs=await this.app.mysql.update('departments',row)
    return rs
  }
  async create (department) {
    var timestamp = Date.parse(new Date())
    department.departmentId = 'epartment_' + timestamp
    department.updateTime = new Date()
    const result = await this.app.mysql.insert('departments', department)
    return { status: 200, data: null, message: 'success!', result: result }
  }
}

module.exports = DepartmentService
