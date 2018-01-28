const AbstractController = require('./abstract')

class PositionController extends AbstractController {
  async getlist () {
    const rs = await this.service.position.getlist()
    if(rs&&rs.length>=0){
      this.success({status:200,data:rs})
    }else{
      this.error()
    }
    
  }
  async add () {
    var position = this.ctx.request.body
    const exist = await this.service.position.getByName(position.positionName)
    if (exist) {
      this.error('职位已存在')
    } else {
      const rs = await this.service.position.create(position)
      const updateSuccess = rs.affectedRows === 1;
      if(updateSuccess){
        this.success(rs)
      }else{
        this.error()
      }
    }
  }
  async edit () {
    var position = this.ctx.request.body
    const exist = await this.service.position.getById(position.positiond)
    if (exist) {
      
      const rs = await this.service.position.update(position)
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
    var positions = this.ctx.request.body
    let positionIds=[]
    for(let i=0;i<positions.length;i++){
      let positionId=positions[i].positionId
      positionIds.push(positionId)
    }
    const getlist = await this.service.position.getByIds(positionIds)
    if(getlist.length>0){
      let positionIds=[]
      for(let i=0;i<getlist.length;i++){
        let positionId=getlist[i].positionId
        positionIds.push(positionId)
      }
      const deleteResult = await this.service.position.deleteByIds(positionIds)
      console.log(deleteResult)
      if(deleteResult.affectedRows>0){
        this.success({'status':200,message:deleteResult.message})
      }else{
        this.error()
      }

    }else{
      this.error()
    }
  }
}

module.exports = PositionController
