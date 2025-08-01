# 🔧 アンケート送信問題のデバッグ手順

## 1️⃣ ブラウザでのデバッグ

### 開発者ツールでのエラー確認
1. GitHub Pagesのアプリを開く: https://TTH15.github.io/kyoto-tower/
2. **F12キー**を押して開発者ツールを開く
3. **Console**タブをクリック
4. アンケートフォームに回答を入力
5. 「送信してガチャ！」ボタンをクリック
6. **赤色のエラーメッセージ**をチェック

### よくあるエラーメッセージ
- `CORS error` → CORS設定の問題
- `Network error` → ネットワーク接続の問題
- `403 Forbidden` → Google Apps Scriptの権限問題
- `404 Not Found` → WebアプリURLの問題

## 2️⃣ Google Apps Scriptでのデバッグ

### ログの確認方法
1. [Google Apps Script](https://script.google.com) にアクセス
2. 「京都タワー アンケート API」プロジェクトを開く
3. 左側メニューから「実行数」をクリック
4. 最近の実行履歴をチェック

### Apps Scriptテスト実行
1. エディターで `initializeSpreadsheet` 関数を選択
2. 「実行」ボタンをクリック
3. エラーが出ないか確認

## 3️⃣ Webアプリ設定の再確認

### デプロイ設定の確認
1. Apps Scriptエディターで「デプロイ」→「デプロイを管理」
2. 設定を確認：
   - **実行ユーザー**: `自分`
   - **アクセスできるユーザー**: `全員`
3. 必要に応じて再デプロイ

## 4️⃣ 簡単な修正案

### CORS問題の場合
Google Apps Scriptに以下のヘッダー設定を追加：

```javascript
function doPost(e) {
  // CORS設定
  const response = {
    success: true,
    message: "Response saved successfully"
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

## 5️⃣ 報告していただきたい情報

以下の情報をお知らせください：

### ブラウザ情報
- [ ] ブラウザの種類（Chrome、Safari、Firefox等）
- [ ] エラーメッセージの詳細
- [ ] ネットワークタブでのHTTPステータスコード

### Apps Script情報
- [ ] 実行ログの内容
- [ ] エラーメッセージ
- [ ] デプロイ設定の状況

### 動作確認
- [ ] 初期ローディングは正常に完了するか
- [ ] 言語切り替えは動作するか
- [ ] フォーム送信時にガチャは動作するか（スプレッドシート保存は失敗）

## 6️⃣ 緊急時の回避策

スプレッドシート連携が動作しない場合でも、ガチャ機能は動作するようにフォールバック処理が組み込まれています。最低限、アンケートとガチャは利用可能です。