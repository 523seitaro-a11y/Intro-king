# イントロポスト

Apple/iTunes Search API の試聴音源を使ったイントロクイズの最小版です。

## 機能

- 既存のお題名から検索
- お題作成画面で曲を検索して追加
- 作成済みお題の編集
- 人気順、ジャンル別、新着順のお題一覧
- お題へのいいね
- 10問の四択イントロクイズ
- 回答時間の計測
- お題ごとのブラウザ内ランキング保存
- マイデータで上位記録と投稿したお題を確認
- リザルト画面から結果をポスト
- プレイヤー名による簡易ログイン

## ローカル起動

静的サイトなので、そのまま `index.html` を開いても動きます。
ローカルサーバーで確認する場合:

```powershell
python -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

## 公開

GitHub Pages、Netlify、Vercel のどれでも公開できます。
最短は Netlify Drop で、このフォルダをアップロードするだけです。

GitHub Pages の場合:

1. GitHub に新しいリポジトリを作成
2. このフォルダを push
3. Settings → Pages → Deploy from a branch
4. Branch を `main`、Folder を `/root` にして保存

## 注意

iTunes Search API の試聴音源やアートワークは Apple の利用条件に従う必要があります。
本番運用では Apple へのリンクや表記、API呼び出しのキャッシュ、ランキング用バックエンド、正式ログインを追加してください。
