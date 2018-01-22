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
  async create (department) {
    var timestamp = Date.parse(new Date())
    department.departmentId = 'epartment_' + timestamp
    department.updateTime = new Date()
    const result = await this.app.mysql.insert('departments', department)
    return { status: 200, data: null, message: 'success!', result: result }
  }
}

module.exports = DepartmentService
