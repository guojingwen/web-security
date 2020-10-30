## 介绍
- 这只是demo学习项目, 对web安全知识的运用，对react技术栈的学习。
- 样式比较low,笔者完全没花时间在上面，是copy过来的
- [在线演示](https://safe.warmplace.cn:10443/)
- [安全知识的学习笔记](https://www.yuque.com/guojw/operation/gu273u)
- [react学习笔记](https://www.yuque.com/guojw/fe-project/vb6m5v)

## mysql环境准备
- docker pull mysql:5.5
- docker run docker run -p 3306:3306 --name mysql5.5 -e MYSQL_ROOT_PASSWORD=todoDream -d mysql:5.5
- docker exec -it 容器id /bin/bash
- mysql -uroot -pc
- create database safety
- exit
- exit
- docker cp safety.sql 容器ID:/
- docker exec -it 容器id /bin/bash
- mysql safety<safety.sql -uroot -ptodoDream

## 账号 guojw  密码 123456 或者注册一个也行 

### web漏洞
 - [ ] XSS，演示不了只能在服务端渲染页面才能演示, 参考老项目
 - [ ] csrf 打开other/csrf.html
 - [ ] 点击劫持 打开 other/clickhijack.html
 - [ ] 网络窃听，nginx配置https即可
 - [ ] 用户id直接存放到cookie里
 - [ ] 密码是明文
 - [ ] 存在sql注入风险
 
 ### web漏洞修复
- [X] XSS，前后端使用xss处理富文本
- [X] csrf 验证码
- [X] 点击劫持  nginx 配置 add_header X-Frame-Options SAMEORIGIN
- [X] 网络窃听，nginx配置https即可
- [X] 用户信息使用session改造
- [X] 密码是明文 登录使用session 密码加密加盐
- [X] 存在sql注入风险 后段错误统一封装不吐给前端

 ### 后期规划
- [X] 找一个react-ui框架稍微优化一下样式
- [X] session持久化
- [X] auth2.0接入（微信、QQ）
- [X] mysql连接池学习总结
 
