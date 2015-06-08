# mytest20150605
テストのリポジトリです。 this is my sandbox repository.


## 概要

自作HTML側クライアントのテンプレートとして作成しているプロジェクトです。
- npm、bower、gulp、React.jsによる開発体制を整備する練習です。
- また、S3へのデプロイも行える状態にしています。


## セットアップに関するメモ

- このプロジェクトは後学のためにgithubに公開状態で登録しています。
	- 私は、公開鍵を用意してssh接続でpushできる状態にして運用しています。
	- このプロジェクトにはそのための鍵情報などは含めておりません。
		- ご自身でセットアップを完了しておいてください。


## 動作物について

- distフォルダに、作業中にgulpでビルドした成果物をまとめています。


## ビルドに関するメモ

- `npm --save-dev`したパッケージがあります。
	- npm installでセットアップしてください。
- bowerでjQueryとReactを取得しています。
	- bower installでセットアップしてください。



## このテンプレートを元に作業する手順について

- .gitフォルダを削除して、`git init`してください。
	- `git remote add origin git@github.com:nonta2014/［ここにリポジトリ名］.git`

- npm init/bower initする必要はありませんが、package.json/bower.jsonを編集してください。
	- パッケージ名やauthor情報の修正を行ってください。



`EOF`
