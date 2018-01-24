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
  async update (department) {
    const row = {
      id: department.Id,
      departmentName: department.departmentName
    };
    const rs=await this.app.mysql.update('departments',row)
    return rs
  }
  async create (department) {
    var timestamp = Date.parse(new Date())
    department.departmentId = 'department_' + timestamp
    department.updateTime = new Date()
    const result = await this.app.mysql.insert('departments', department)
    return result
  }
}

module.exports = DepartmentService
