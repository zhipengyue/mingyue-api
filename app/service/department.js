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
  async getByIds (ids) {
    const results = await this.app.mysql.query(`select * from departments where departmentId in (${this.app.mysql.escape(ids)})`, []);
    return results
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
  
  async deleteByIds (ids) {
    /**
     * ## REDO
     * 删除子部门，以及子部门下的子部门
     * 处理所有涉及到部门的数据表
     * 需要重写
     */
    const results = await this.app.mysql.query(`delete from departments where departmentId in (${this.app.mysql.escape(ids)})`, []);
    return results
  }
}

module.exports = DepartmentService
