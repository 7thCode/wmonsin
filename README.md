# W-monsin
web問診表

  医院等で使用するための問診票をMEANスタック/マテリアルデザインで実装しました。
  現在、ORCAとの受付の連携、及び問診票エディタを開発中です。
  最終的には問診票だけではなく、Webでの汎用的なアンケート/入力フォーマットシステムになる予定です。


インストール方法

  1.mongodb

    まず、mongodbを用意します。もしインストール済みなら、不要です。
    dbまでの接続文字列を用意してください。

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

  5.コンフィグ

    起動後、ユーザ名root、パスワードrootでログイン後、スタッフ画面のコンフィグから、Connectionに先ほど用意した接続文字列を入力してください。
    同時にSession KeyやPassword Key、Account Keyも任意のものに変更してください。
    変更が終わったらSaveボタン（フロッピーアイコン）をクリックしてください。
