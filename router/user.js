const mongoose = require('mongoose');
//引入对外暴露接口的db.js，此时登录界面和注册界面要操作数据库的话就要引入这个文件
const db = require('./db.js');
const mySchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,//非空
    unique:true,//唯一
  },
  password:{
    type:String,//不是设置为number  因为要用md5加密，
    required:true
  }
})
const myModel = db.model('modelName',mySchema,'user')
//对外暴露，同时把添加数据的方法返回出去
module.exports = {
   insert:function(obj){
     //mongoose添加数据的方法
     return myModel.create(obj);
   },
   find:function(obj){
     return myModel.findOne(obj);
   }

}