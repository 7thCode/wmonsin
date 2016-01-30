ssh root@188.166.244.121

コンテナ作る
docker run -it --name ubuntu1 ubuntu1 /bin/bash






いろいろ....


コンテナ保存
docker commit ubuntu1 ubuntu1

コンテナ消す
docker rm ubuntu1

コンテナリスト
docker ps -a



user,pwdはconfig.connectionと合わせる。

    "connection": "mongodb://username:password@localhost/dbname"

であれば

    >mongo
    >use dbname
    >db.createUser({user: "oda",pwd: "password",roles: [ "readWrite", "dbAdmin" ]})



mongo  localhost/patient --quiet  init.js