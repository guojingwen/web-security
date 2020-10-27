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

## 账号 TooBug  密码 123456 

### web漏洞
 -[ ] XSS，演示不了只能在服务端渲染页面才能演示, 参考老项目
 -[ ] csrf 打开other/csrf.html
 -[ ] 点击劫持 打开 other/clickhijack.html
 -[ ] 网络窃听，nginx配置https即可
 -[ ] 密码是明文
 -[ ] 存在sql注入风险

 
 
