const mongoose = require('mongoose');
const db = require('./db.js')
const mySchema =new mongoose.Schema({
    name:{
      type:String,
      required:true,
      unique:true
    },
    photos:[]
});

const myModel = db.model('modelName',mySchema,'photos');

module.exports = {
  //创建相册
  createAlbum : function(obj){
    return myModel.create(obj);
  },
  //查找所有相册；为了显示在下拉框里面
  findeAlbum : function(obj){
    return myModel.find(obj)
  },
  //为了选择相册上传相片的时候只选择当前相册，如果还是查找所有相册的话，
  //即时查询到当前的相册，但是得到的还是一个数组形式，获取不到里面的photos，就
  //上传不了相片进去
  findeAlbumPhoto : function(obj){
    return myModel.findOne(obj)
  }
}


