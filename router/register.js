const express = require('express');
const registerRouter=express.Router();
const user = require('../model/user.js')
const md5 = require('md5');
 //渲染注册界面
  registerRouter.get('/',function (req, res) {
    res.render('register.njk');
  })

  //监听注册接口发送过来的数据请求
  registerRouter.post('/',function (req, res) {
    console.log(req.fields); //req.fields注册页面传过来的值
    // 获取用户名
    const username = req.fields.username;
    // 获取密码
    const password = req.fields.password;
    // 获取确认密码
    const repassword = req.fields.repassword;
    //使用异常捕获抛出异常
    try {
      if (username.length < 5 || username.length > 10) {
        console.log(username.length)
        throw new Error('用户名长度不符合要求')
      }
      if (password != repassword) {
        throw new Error('两次输入的密码不一致！')
      }
    } catch (error) {
      //如果捕获到了有if中的异常，那么就走这里，把数据用json返回出去到注册页面的成功回调的msg中
      return res.json({ 'msg': error.message })
    }
    //如果没有错就走这里，就开始实现连接数据库，把数据加入到数据库中，入口文件不处理逻辑，所以把添加数据，
    //查询数据等方法放到model文件夹中处理，在这个页面中引用model文件夹
    //这里的insert是自己设定的添加数据到数据库的函数，函数获取的返回值就是mongoose添加数据的方法
    const obj = {
      username: username,
      password: md5(password)
    }
    user.insert(obj).then(function (doc) {
      console.log(doc)
      res.json({ 'msg': '注册成功' })
    }).catch(function (err) {
      res.json({ 'msg': '注册失败' })
    })
  })


 module.exports =registerRouter;
 