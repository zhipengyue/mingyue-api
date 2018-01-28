const Service = require('egg').Service
class PositionService extends Service {
  async getlist () {
    const positions = await this.app.mysql.select('positions')
    return positions
  }
  async getByName (name) {
    const position = await this.app.mysql.get('positions', { positionName: name })
    return position
  }
  async getById (id) {
    const position = await this.app.mysql.get('positions', { positionId: id })
    return position
  }
  async getByIds (ids) {
    const results = await this.app.mysql.query(`select * from positions where positionId in (${this.app.mysql.escape(ids)})`, []);
    return results
  }
  async update (position) {
    const row = {
      id: position.Id,
      positionName: position.positionName
    };
    const rs=await this.app.mysql.update('positions',row)
    return rs
  }
  async create (position) {
    var timestamp = Date.parse(new Date())
    position.positionId = 'position_' + timestamp
    position.updateTime = new Date()
    const result = await this.app.mysql.insert('positions', position)
    return result
  }
  
  async deleteByIds (ids) {
    /**
     * ## REDO
     * 删除子部门，以及子部门下的子部门
     * 处理所有涉及到部门的数据表
     * 需要重写
     */
    const results = await this.app.mysql.query(`delete from positions where positionId in (${this.app.mysql.escape(ids)})`, []);
    return results
  }
}

module.exports = PositionService
