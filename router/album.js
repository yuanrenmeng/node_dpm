const express = require('express');
const albumRouter = express.Router();
const album = require('../model/album.js');
const formidable = require('express-formidable');
const path = require('path');
  //创建相册
  albumRouter.post('/create', function (req, res) {
    const obj = {
      name : req.fields.albumname
    }
    //  console.log(req.fields)
    album.createAlbum(obj).then(function (doc) { 
      if(doc){
        return res.json({ 'msg': '创建成功' });
      }else{
        return res.json({ 'msg': '创建失败' });
      }
    }).catch(function(err){
       return res.json({ 'msg': err.massage });
    })
  })

  //上传图片
  albumRouter.post('/upload', function (req, res) {
      // console.log(req.fields)//albumname: 'add' 获取到所在相册的名字
      // console.log(req.files)  //获取到上传图片的所有信息，路径，大小，格式等
      //拿到图片的名字
      const photoName = path.basename(req.files.file.path)
      console.log(photoName)//图片名字
       const obj = {
      name : req.fields.albumname
    }
     album.findeAlbumPhoto(obj).then(function(doc){
        if(doc){    
          doc.photos.push(photoName);//把上传的图片的名称添加到所查询的那个相册名的photos字段中
          doc.save( function(err,res){ //保存起来，只添加不保存不行
              if(doc){
               return res.json({'msg':'添加成功'})
              }else{
               return res.json({'msg':'添加失败'})
              }
          })
        }else{
           return res.json({'msg':'相册不存在'})
        }
     }).catch(function(err){
        return res.json({'msg':err.massage})
     })
      
  })


  module.exports = albumRouter;