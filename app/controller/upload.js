const AbstractController = require('./abstract')
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class UploadController extends AbstractController {
  async create () {
    const stream = await this.ctx.getFileStream();
    //const filename = encodeURIComponent(stream.fields.name) + path.extname(stream.filename).toLowerCase();
     //console.log(stream.filename)
    var timestamp = Date.parse(new Date())
    var random=Math.round(Math.random()*10000);
    const filename='upload_'+timestamp+'_'+random+path.extname(stream.filename).toLowerCase()
    const target = path.join(this.config.baseDir, 'app/public',filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      this.error(err)
      throw err;
    }
    //this.ctx.redirect('/public/' + filename);
    this.success('public/' + filename)
  }
}

module.exports = UploadController
