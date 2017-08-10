const express = require('express');
const loginRouter = express.Router();
const md5 = require('md5');
const user = require('../model/user.js')

  //渲染登录界面
  // loginRouter.get('/login', function (req, res) {
  loginRouter.get('/', function (req, res) {
    res.render('login.njk');
  })

//监听登录接口发送过来的数据请求
// loginRouter.post('/login', function(req,res){
  loginRouter.post('/',function(req,res){
  const username = req.fields.username;
  const password = req.fields.password;
  console.log(req.fields)
  user.find({'username':username}).then(function(doc){
     console.log(doc) //查询到的整条数据
    if(doc){
      if(doc.password == md5(password)){
        //如果密码一致就设置session
        req.session.user = doc;//user是用到nav.njk中显示登录的用户
        return res.json({'msg':'登录成功'})
      }else{
        return res.json({'msg':'密码错误'})
      }
    }else{
      return res.json({'msg':'用户名不存在'})
    }
   
  }).catch(function(err){
    res.json({'msg':'登录失败，请确认用户名'})
  })
})

module.exports = loginRouter;