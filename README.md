###AlwaysAround 宠物托管服务 App

####简介
AlwaysAround 是一个类 Uber 的宠物托管服务App，我们提供给用户提供可靠的宠物托管服务：

1. 统一管理的专门的宠物托管卡车，用户可以直接将宠物寄存在这个移动卡车上，定时定点提取和领取；
2. 经过认证的宠物爱好者，可以通过 App 找到有寄存宠物需求的用户，经过沟通，临时托管不方便的用户（比如用户需要进入宠物禁止入内的商场和其他公众场所）

####App 原型截图

![home](http://om73fjcgf.bkt.clouddn.com/04%E4%B8%BB%E7%95%8C%E9%9D%A2@2x.png?imageMogr2/auto-orient/thumbnail/x400/blur/1x0/quality/75|imageslim)
![home1](http://om73fjcgf.bkt.clouddn.com/08%E9%A2%84%E7%BA%A6%E6%88%90%E5%8A%9F@2x.png?imageMogr2/auto-orient/thumbnail/x400/blur/1x0/quality/75|imageslim)
![hom2](http://om73fjcgf.bkt.clouddn.com/25%E7%8B%97%E7%8B%97-%E5%9F%BA%E6%9C%AC@2x.png?imageMogr2/auto-orient/thumbnail/x400/blur/1x0/quality/75|imageslim)

####技术栈
- 采用 Node.js API 框架 [Restify](http://restify.com/) 构建 Restful API, 为 iOS 端提供 API
- 数据库采用 MongoDB 的 Node.js 包 [Mongoose](http://mongoosejs.com/)
- 实时通信服务（如司机调度，订单匹配和追踪）采用 SocketIO 通信，同时引入 Redis 用作简单的消息队列
- 采用 ReactJS 开发后台管理界面，已经初步实现一个在线的托管服务模拟器，管理员可以在后台直接模拟宠物托管卡车，与 App 用户发生互动
- 验证使用 [JWT](https://jwt.io/)，实现 Stateless 验证用户，针对浏览器端也避免使用 cookie 和session
- 服务器采用 Nginx 配合 [PM2](https://github.com/Unitech/pm2) 部署在 DigitalOcean 上，并且实现自动脚本部署

#####通信服务原型
![core_service](http://om73fjcgf.bkt.clouddn.com/11478897778_.pic_hd_copy.jpg)

####项目WIKI
采用 [dokuwiki](https://www.dokuwiki.org/dokuwiki#) 搭建项目 WIKI，地址在 http://162.243.187.85/dokuwiki/doku.php?id=api (服务器在美国，访问较慢）

测试账户: test
密码: test123

![wiki](http://om73fjcgf.bkt.clouddn.com/Screen%20Shot%202017-03-05%20at%209.23.01%20PM.png)

