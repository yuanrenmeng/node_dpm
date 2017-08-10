const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const config = require('config-lite')(__dirname);//会自动找寻config文件夹中的的default文件
const formidable = require('express-formidable');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session)
const router = require('./router/index.js')
//配置模板引擎
nunjucks.configure('views',{express:app});

//设置静态文件处理
app.use(express.static('public'));
app.use(express.static('upload'));
//配置formidable
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: './upload',  //注意路径  要用./不然上传的图片找不到位置
   keepExtensions:true,  //后缀名
}))

//配置cookie
app.use(cookieParser());

//配置session
app.use(session({
 resave:false,
 saveUninitialized:false,
 secret:'album', //保存session的数据库名，要和获取登录注册等数据的数据库名一样
 cookie:{maxAge:24*3600*1000},
 store:new mongoStore({
    url:config.dbURL,
 })
}))

//配置自己的中间件
app.use('/',function(req,res,next){
  //设置网站的每个网页的标题都是一样的
  app.locals.title = config.title;
  // 每一次请求都会到这个方法,一旦给req.session.user设置值,全局都可以拿到,
  // 直接传递给模板
  res.locals.user = req.session.user;
  next();
})

//把app传递到router/index.js中
router(app);

//启动监听
app.listen(config.port)










