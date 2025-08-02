DailyEventWeb-test 一个个人网站的测试，可以进行基础时间的可运行网站
-添加事件- 记录各项事件的发生日期、起始时间、终止时间
-共享日历- 添加同伴后可查看对方事项
-删除事项- 删除记录错误的事项
###安装依赖
本项目后端使用node.js进行开发，数据储存使用MySQL，需下载body-parser、cors、express、express-session、fs、mysql、session、uuid，及MySQL数据库，请在命令行执行操作
"cd 你的项目位置"
"npm install ***(该下载内容名字)"
请保证你的MySQL数据库存在数据库Web，内有两表User与Tasks
###使用方式
更改域名与端口后，请在你的服务端运行以下命令：
"node app.js"
在出现消息后即可正常运行该网页
