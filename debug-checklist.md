# 🔧 スプレッドシート連携デバッグチェックリスト

## 📋 現在の状況
- ✅ WebアプリURL取得済み
- ❌ アンケートデータが記録されない
- ❓ 接続状況不明

## 🔍 デバッグ手順

### ステップ1️⃣：Google Apps Script 基本テスト

#### 1-1. ブラウザで直接テスト
以下のURLに直接アクセス：
```
https://script.google.com/macros/s/AKfycbw593RB4kx3nbQXiSzpjpw7VvT2-U3d6usKT7OZL-erRFSN_a6GdtwlRNd5Ag0U0RHomA/exec
```

**期待される結果：**
```json
{"success":true,"message":"API is working","timestamp":"2025-08-01T..."}
```

#### 1-2. Apps Script ログの確認
1. [Google Apps Script](https://script.google.com) にアクセス
2. 「京都タワー アンケート API」プロジェクトを開く
3. 左メニュー「実行数」をクリック
4. 最近の実行履歴を確認

### ステップ2️⃣：フロントエンド テスト

#### 2-1. ブラウザコンソールでのデバッグ
GitHub Pagesアプリを開いて：
1. **F12** → **Console**タブ
2. 以下を実行：

```javascript
// 接続テスト
fetch('https://script.google.com/macros/s/AKfycbw593RB4kx3nbQXiSzpjpw7VvT2-U3d6usKT7OZL-erRFSN_a6GdtwlRNd5Ag0U0RHomA/exec')
  .then(response => response.json())
  .then(data => console.log('接続テスト成功:', data))
  .catch(error => console.error('接続テスト失敗:', error));
```

#### 2-2. アンケート送信テスト
アンケートフォームに入力して送信し、Consoleでエラーを確認

### ステップ3️⃣：問題特定チェックポイント

#### よくある問題：
- [ ] WebアプリURL が古い/間違っている
- [ ] Google Apps Script のデプロイ設定ミス
- [ ] CORS エラー
- [ ] スプレッドシートIDの設定ミス
- [ ] 権限・認証の問題

#### エラーメッセージ例：
- `CORS error` → CORS設定の問題
- `403 Forbidden` → 権限の問題
- `404 Not Found` → URLの問題
- `Network error` → 接続の問題

## 🚀 次のアクション

確認結果に応じて対策を実行します。