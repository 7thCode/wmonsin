# wmonsin
web問診表

インストール方法

  1.mongodb

    まず、mongodbを用意します。
    もしインストール済みなら、dbまでの接続文字列を用意してください。

      例
        mongodb://localhost/patient


  2.node.js

    node.jsをインストールしてください。用意されていれば必要ありません。


  3.bower,Typescript,Jade,less

    node.js付属のnpmを使用してbower,Typescript,Jade,lessをインストールします。

      npm install -g bower
      npm install -g typescript
      npm install -g jade
      npm install -g less


  4.https://github.com/7thCode/wmonsin.gitをプル

    任意のディレクトリにhttps://github.com/7thCode/wmonsin.gitをプルしたら、そのディレクトリで

      npm install

    そして、publicディレクトリで

      bower install

    そしてtsをjsにコンパイル、jadeをhtmlに、lessをcssにコンパイルして、ディレクトリで

      node bin/www

    でport3000番で動きます。

    プロセスを継続的に起動しておくにはforeverなどをお使いください。
