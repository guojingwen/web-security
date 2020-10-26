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

