# AWS DevDay 2020 F-9 CDK 我流ベストプラクティスの紹介

## このリポジトリについて
* AWS DevDay 2020 で発表した F-9 のセッションでの具体的な実装を書いたものになります
* このまま動くことを保証しているわけではありません (cdk build できる状態までの確認となってます)
* 説明をしたほうがいい部分は //COMMENTED というコメントを残しています

## ベストプラクティス
### mycdk
* deploy 時に AccountAlias を出力
* package.json の中身を見て開発環境だと確認なし、本番環境だと確認ありとかにしてる
* NotificationArns を自動的につけるようにしてる。
* AWS SSO と連携するときには現状 Environment でしか実行できないけども、ここで得られる AccessKeyId, SecretAccessKey には Region 情報が無いので、勝手につけるように

### cdk.json
* output directory の変更
* lib/xxx で絶対パスを使えるように tsconfig の修正

### tsconfig.json
* output directory の変更
* lib/xxx で絶対パスを使えるように tsconfig の修正

### bin/aws-cdk-bestpractice.ts
* Stack の依存関係と Stack の論理構造の定義
* AccountId から開発環境・本番環境などの変数を取ってくる

### lib/@aws-cdk/*
* aws-cdk の patch を定義するレイヤー
 * https://github.com/aws/aws-cdk/issues/9926 これがまだ入ってない(1.60.0)として作ってあります。

### lib/construct/*
* 自プロダクト用の construct を定義するレイヤー
    * static-webapp.ts のように patterns っぽいのも入ってるけども、それも含めてここに定義してあります
* 具体的には以下のようなものが入っています
    * construct にわたす際のデフォルトパラメータの修正
        * cloudfront.ts の errorResponse の定義
        * aurora.ts でデフォルト暗号化 ON に
    * デフォルト動作の修正
        * aurora.ts で parameterGroup を作るように
    * 基本的な命名規則の定義
        * s3.ts で suffix を自動でつけるように

### lib/helper/*
* 雑多だけども lib/construct に直接書きたくないものを定義するレイヤー
* 具体的には以下のようなものが入っています
    * RemovalPolicy の設定
    * S3 の Suffix の設定
    * Fargate にわたす標準的な Environment の設定

### lib/stack/*
* Stack の定義をするレイヤー
* 従来どおり Construct を組み合わせて Stack を組み合わせるところ




