// module.exports = options => {
//   return async function auth (ctx, next) {
//     if (ctx.url.indexOf('server') >= 0) {
//       const user = ctx.service.cookie.getUser()
//       if (user) {
//         ctx.authUser = user
//         await next()
//       } else {
//         ctx.status = 401
//       }
//     } else {
//       await next()
//     }
//   }
// }
var nJwt = require('njwt')
var config = require('../../config/config.default')
module.exports = options => {
  return async function auth (ctx, next) {
    
    if (ctx.url.indexOf('server') >= 0) {
      let token=ctx.request.header.token
      let tokenSuccess=false
      tokenSuccess=getToken(ctx,tokenSuccess)
      if(tokenSuccess){
        await next()
      }else{
        ctx.status = 401
        ctx.message = 'token超时'
      }
    } else {
      /**
       * 不需要token的接口
       */
      await next()
    }
  }
  
}
async function getToken(ctx){
    let token=ctx.request.header.token
    let tokenSuccess=false
    await nJwt.verify(token,config().md5Key,(err,verifiedJwt)=>{
      if(err){
        console.log('///////////tokne error//////////////')
        tokenSuccess=false
      }else{
        console.log('////////////token success//////////////////')
        //let promissions=verifiedJwt.body.permissions;
        /**
         * 解析完token后，拿到用户id，从数据库权限列表中获取该用户权限，与请求地址比对，查看是否具有该权限。
         */
        //await next()
        tokenSuccess=true
      }
    })
    return tokenSuccess
  
}