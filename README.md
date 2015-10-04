# wmonsin - Web問診表
## Medical questionnaire


医院等で使用するための問診票をMEANスタック/マテリアルデザインで実装しました。
ORCAとの受付の連携、及び内臓エディタによる問診票のカスタマイズが可能です。
最終的には問診票だけではなく、Webでの汎用的なアンケート/入力フォーマットシステムになる予定です。

## インストール方法

wmomsinはnode.js上で動作します。
またデータストアにはMongoDBを使用するため、node.jsとMongoDBをインストールする必要が有ります。


- - -
#### 1.mongodbのインストール

まず、mongodbを用意します。もしインストール済みなら不要です。

#### [MongoDB](https://www.mongodb.org/ "MongoDB")


dbの接続文字列をメモしてください。

例

```bash
mongodb://localhost/patient
mongodb://your.domain.name/new_db_name
```

- - -
#### 2.node.jsのインストール

node.jsをインストールしてください。用意されていれば必要ありません。

#### [node.js](https://nodejs.org/ "node.js")


- - -
#### 3.ダウンロード

以下のどちらかのファイルをダウンロードして展開してサーバにデプロイください。

ライブラリなし(ダウンロード軽いけどちょい手間)

#### [wmonsin without library](https://dl.dropboxusercontent.com/u/2004743/wmonsin_without_lib.zip "wmonsin without library")

ライブラリ付属(ダウンロード重いけど手間なし！)

#### [wmonsin with library](https://dl.dropboxusercontent.com/u/2004743/wmonsin_with_lib.zip "wmonsin with library")

ここから先の手順はダウンロードしたパッケージごとに異なります。


- - -
#### 4.サーバモジュールをインストール

"wmonsin with library"をダウンロードされた場合、このセクションは不要です。
次のセクションに進んでください。

まずサーバライブラリをインストールしてください。

```bash
cd wmonsin
sudo npm install
```

publicディレクトリでクライアントライブラリをインストールしてください。

```bash
cd public
bower install
```

で完了です。


- - -
#### 5.起動

ディレクトリで

```bash
cd wmonsin
node bin/www
```

で

```
http://localhost:3000
```

で動きます。
プロセスを継続的に起動しておくにはforeverなどをお使いください。


- - -
#### 6.コンフィグ

起動後、ユーザ名root、パスワードrootでログイン後、スタッフ画面のコンフィグから、Connectionに先ほど用意した接続文字列を入力してください。
同時にSession KeyやPassword Key、Account Keyも任意のものに変更してください。
変更が終わったらSaveボタン（フロッピーアイコン）をクリックしてください。