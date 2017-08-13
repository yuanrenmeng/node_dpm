# node_dpm
nodeJS相册

实现思路：

相册
第一步：配置要用到的模块，文件结构
1.入口文件index.js要用到的模块
express：
nodeJS的框架，为了可以设置路由app,可以直接同个app.get/app.post发送求情，router也是express的一个方法，express().Router
nunjucks:
可以用于动态加载模板
express-formidable
(body-parser)只能获取表单数据，不能获取文件上传)
可以解析表单数据，文件上传等
express-session:
设置session数据
cookie-parser
设置cookie数据
connect-mongo
让session数据保存到数据库中
md5	
数据加密
config-lite
存放常量配置，不设置默认设置去寻找config文件夹中default文件夹，要对外暴露接口，如果要设置的话去npm中查看用法

2.要用到的文件结构
model
存放需要数据库的页面，如用户添加查询数据等
public
存放页面相关的js,css,images文件
upload
上传的东西，图片等
views
相应的网页模块，base.njk/index.njk/nva.njk等
routes
路由文件，处理对应的运算逻辑，如登录的逻辑处理，注册的逻辑处理等，然后把接口暴露出去，入口文件index.js直接应用，因为入口文件只放配置，不处理逻辑运算
config
存放要用的到常量，比如端口80，网站的title，配置在同个文件到时要改的时候容易，文件名为config的default文件中，

第二步：通过输入127.0.0.1可以输出相册的头部，相册的头部用bootstrap中的导航栏改写
1.在入口文件index.js中：
--添加需要用到的模板

--配置模板引擎--nunjucks,configure，(表明网页模板的入口文件，并让模板支持app路由，这样就可以用路由渲染出网页)

--配置formidable，根据npm中express-formidable里面的配置要求配置：编码、上传文件的文件夹、是否支持扩展名

--配置cookie

--配置session：除了配置session需要的参数，还要加上store的配置，让session能写入数据库

--配置自己的中间件：这个是为了是访问网站的所有页面时网页的所有title都是一样的，这样就不用每个页码都设置了app.locals.title= config,title
--启动监听。端口也是传入的config.port

2.因为配置中间件和启动监听都是要设置常量，所以这里把它配置进入了config文件夹张的default文件，对外把接口暴露module.exports

3.到views里面设置网页，index.js渲染的是views中的index.njk文件，index.njk继承base.njk，base.njk中设置网站头部，内容和尾部，把头部html些人nav.njk 文件中,base.njk中的头部把nav.njk包含进去



4.通过booststrap的全局css样式中的表单样式设置注册和登录页面，这两个页面分别都继承extends "base.njk"，然后把表单样式写在content里面覆盖base.njk中content的空内容，注册页面和登录页面要接受ajax数据



5.在nav中的设置为登录和注册的li中的a链接改为herf='/login'  和 herf= '/register',这里这样写是因为还要在index.js的入口文件中渲染这两个页面，获取的路径就是根路径，所有不能像一般的网页链接一样链接到login.njk

6.在index.js入口文件中，渲染注册页面，登录页面

第三步：点击注册按钮实现注册功能
1.config文件夹中的default文件配置数据库的链接路径，其他页面用到直接调用

2.在model文件夹中创建db.js用来存放所有和数据库相关的操作，mongoose-Schema==>Medel==>Entity(没有用到)，链接数据库的时候调用config的配置，对外暴露接口，接口中都是设置自定义对数据库的相关操作的方法

3.在index.js界面实现注册的功能，暂时都写在index里面，到时候还要把每个功能，如注册登录等抽取到ruoter文件夹中创建独立出来



第四步：点击登录按钮实现登录功能，注销功能
1.先在nav.njk界面中的登录和注册的li中添加判断条件，如果是登录状态就显示登录的用户名和注销，如果不再登录装填才显示登录注册，通过判断是否有session且设置了的user值传进来，有的话就显示if里面的，记住在登录功能的逻辑判断中，当登录是查询数据库条件，当用户名密码匹配成的时候，顺便保存session值req.session.user = doc ,  然后记得把session值传到每个页面中res.locals.user = req.session.user(在自己配置的中间件中设置)，不然nav.njk获取不到

2.然后到db.js文件的对外接口module.exports中定义查询数据库的方法，直接返回数据库的数据查询方法，传入对象

3.在index.js中实现数据查询的方法：先定义监听登录接口发送过来的数据请求方法，获取页码发送过来的数据，然后直接查询数据，和注册页面不一样，注册页面先要判断输入的数据是否符合要求在create到数据库，而登录界面是直接先按传入的条件查询数据库，在判断用户名，密码是否正确，在都正确的时候设置session值

4.当设置了session值后，页面获取到了session值，此时返回首页就会显示的是当前的登录用户

5.实现注销功能，主要是让它的session值为空


第五步：抽取代码
1.抽取index.js中逻辑功能实现模块，让index.js只是入口文件，不实现逻辑功能，即是把注册功能，登录功能单独作为一个个单独的路由，把所有渲染页面也作为一个index路由，这个路由中包含注册/登录相关信息、先把入口文件index.js中的所有注册/登录的渲染方法/实现方法都剪切到路由文件夹router的index文件中，入口文件index.js只需要导入router的index文件，然后传入应用层路由app，outer的index文件中把对外暴露的接口中暴露一个方法，方法中传入的参数是app即可


2.再把router中的index.js中的注册和登录各自单独抽取出来作为一个单独的功能，router中的index.js中只单独导入这两个功能的接口,注意的是，把这两个功能从router的index.js中抽出来的时候，可以把渲染和获取数据的方法中的路径‘/login’和‘/register’去掉只保留‘/’，以为在router的index.jsindex中使用了app.use('/register',register)和app.use('/login',login)。register/login是引入login.js/register.js时定义的名称
router的login.js

router的register.js

抽出这两个功能后router的index.js

3.把注册和登录等用户操作获取数据操作数据库的文件分离出单单独做一个user用户操作数据库和album相册操作数据库分离出来，让原来的db.js对外暴露的是module.exports = db,让user.js和album.js引入就可以了，记得去修改login.js / register.js中引入数据库文件从db.js 改为user.js
修改后db,js

user.js

login.js引入数据库改为


第六步：添加相册和显示相册
1.在views视图文件夹的index.njk文件中重写content部分，获取循环设置通过bootstrap获取到的缩略图

2.在router里面创建相册路由album.js，里面存放的是相册相关的数据库操作，然后在router的index.js里面导入相册路由，
index.js里面导入创建的路由

3.在model中创建albums.js数据库操作的对外接口，定义了相册相关操作如添加相册，查询相册的对外接口函数，然后在router的album.js中实现定义接口函数的方法的实现
model中的album.js

router中的album.js

到这里实现了相册的创建，以及存放到数据库中，接下来就是在把所有创建的相册名显示到下拉类表中，和显示在首页中。相册封面图片显示不出来的原因是没有在入口文件index.js值把public设定为静态文件



在router中的index.js，显示下拉类别

在router中的index.js，显示首页相册列表


第七步：实现图片上传和每个相册图片的显示
1.在model文件夹中定义一个方法为了选择相册上传相片的时候只选择当前相册，如果还是查找所有相册的话，即时查询到当前的相册，但是得到的还是一个数组形式，获取不到里面的photos，就上传不了相片进去

2、在路由router的album.js中定义上传图片的方法，先指定图片上传的地址/upload，在获取上传图片的名字，为了存放进相片数组photo里面，在获取当前选中的相册名字，然后查找该相册名字把图片插入进去，此时图片能插入，但是会把错，这是因为express-formideble里面自带的bug,这是要把它换成原生的formidable

3.在views里面创建显示所有上传图片的页面，bootstrap里面的相片缩略图，也是和index.njk展示相册一样，遍历然后取出每张图片展示，然后到router里面的index.js中渲染出来，


router的index.js中渲染

第八步：把express-formidable替换成原生的formidable，到npm里面找formidable的使用方式（因为express-formidable都后面上传相册的时候会出现一直报错）
