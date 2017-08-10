const register = require('./register');
const login = require('./login'); //这里是路径，记得要  ./
const albumRouter = require('./album.js')
const album = require('../model/album.js');
module.exports = function (app) {
  //监听根目录
  app.get('/', function (req, res) {
     album.findeAlbum().then(function(doc){
    //  console.log(doc)//{ _id: 593fbbfc32d39515c4182366, name: '风景', __v: 0, photos: [] }
     if(doc){
  //渲染的时候给渲染的页面传值，用到这个值得地方就会用到
      res.render('index.njk',{'albumArr':doc})
     }
   }).catch(function(err){
     res.send({'msg':err})
   })
  })

  //管理员界面
  app.get('/admin', function (req, res) {
   album.findeAlbum().then(function(doc){
     if(doc){
  //渲染的时候给渲染的页面传值，用到这个值得地方就会用到
      res.render('admin.njk',{'albumArr':doc})
     }
   }).catch(function(err){
     res.send({'msg':err})
   })
   
  })


  //渲染图片列表界面
  app.get('/:name',function(req,res){
    if(req.url == '/favicon.ico') {return};
    const obj = {
      name: req.params.name
    }
    album.findeAlbumPhoto(obj).then(function(doc){
        res.render('photos.njk',{'photos':doc.photos})
    }).catch(function(err){
     res.send({'msg':err})
   })
   
  })

  //注册相关
  app.use('/register', register)

  //登录相关
  app.use('/login', login)

  //监听注销接口
  app.get('/loginout', function (req, res) {
    //让session的值为空
    req.session.user = null;
    res.send('注销成功')
  })


  //相册相关
  app.use('/album',albumRouter);//路径这样写是因为在管理员界面admin.njk获取ajax数据的URL规定了

}
