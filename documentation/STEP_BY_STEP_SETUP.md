# 🔧 Google Apps Script 完全セットアップガイド

このガイドでは、Google Apps Scriptを使ったことがない方でも確実にセットアップできるよう、**画面の操作を含めて詳しく説明**します。

## 📝 事前準備

- Googleアカウントが必要です
- PCのブラウザ（Chrome、Firefox、Safari等）を使用してください
- スマートフォンでは設定が困難なため、必ずPCで作業してください

---

## ステップ1️⃣ : Googleスプレッドシートを作成

### 1-1. Google Sheetsにアクセス
1. ブラウザで [https://sheets.google.com](https://sheets.google.com) にアクセス
2. Googleアカウントにログインしていない場合は、ログインしてください

### 1-2. 新しいスプレッドシートを作成
1. 「+」ボタンまたは「空白」をクリック
2. 新しいスプレッドシートが開きます

### 1-3. スプレッドシートに名前を付ける
1. 左上の「無題のスプレッドシート」をクリック
2. 「京都タワー アンケート データベース」などの名前を入力
3. Enterキーを押して確定

### 1-4. スプレッドシートIDをメモ
1. ブラウザのアドレスバーのURLを確認
2. `https://docs.google.com/spreadsheets/d/【この部分】/edit#gid=0`
3. 【この部分】がスプレッドシートIDです
4. **このIDを必ずメモ帳などにコピーして保存してください**

1QMnM8rq728H1darm5dSRxHDzd_CKGV63EH-Fp8r9-Ts

---

## ステップ2️⃣ : Google Apps Scriptエディターを開く

### 2-1. Apps Scriptを開く
1. スプレッドシートの画面で、上部メニューの「拡張機能」をクリック
2. ドロップダウンメニューから「Apps Script」をクリック
3. 新しいタブでApps Scriptエディターが開きます

### 2-2. プロジェクトに名前を付ける
1. 左上の「無題のプロジェクト」をクリック
2. 「京都タワー アンケート API」などの名前を入力
3. 保存アイコン（💾）をクリック

---

## ステップ3️⃣ : コードを貼り付ける

### 3-1. 既存のコードを削除
1. エディター画面に `function myFunction() {` から始まるコードが表示されています
2. **全て選択**（Ctrl+A または Cmd+A）して削除してください

### 3-2. 新しいコードを貼り付け
1. 以下の「コピー用コード」をコピーしてください
2. エディターに貼り付けてください（Ctrl+V または Cmd+V）

---

## 📄 コピー用コード

```javascript
// 京都タワー SANDO バル アンケートアプリ - Google Apps Script
// このコードをGoogle Apps Scriptにコピーして使用してください

// スプレッドシートID（次のステップで設定します）
const SPREADSHEET_ID = '1QMnM8rq728H1darm5dSRxHDzd_CKGV63EH-Fp8r9-Ts';

// シート名
const SHEETS = {
  RESPONSES: '回答データ',
  GACHA_CONFIG: 'ガチャ設定',
  TRANSLATIONS: '翻訳データ'
};

/**
 * Web App のメインエントリーポイント
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'saveResponse':
        return saveResponse(data);
      case 'getGachaConfig':
        return getGachaConfig();
      case 'getTranslations':
        return getTranslations();
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * GET リクエスト用（テスト用）
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'getGachaConfig':
        return getGachaConfig();
      case 'getTranslations':
        return getTranslations();
      default:
        return createResponse(true, 'API is working');
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * アンケート回答を保存
 */
function saveResponse(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.RESPONSES);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.RESPONSES);
      // ヘッダー行を設定
      sheet.getRange(1, 1, 1, 7).setValues([[
        'タイムスタンプ', '出身', 'SANDO バルを知った方法', 
        '来日前のリサーチ方法', '来日後のリサーチ方法', '言語', 'IPアドレス'
      ]]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    // データを追加
    const timestamp = new Date();
    const newRow = [
      timestamp,
      data.responses.origin,
      data.responses.how_know,
      data.responses.research_before,
      data.responses.research_after,
      data.language || 'ja',
      data.ip || 'unknown'
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(true, 'Response saved successfully', {
      timestamp: timestamp.toISOString(),
      rowNumber: sheet.getLastRow()
    });
    
  } catch (error) {
    console.error('Error saving response:', error);
    return createResponse(false, 'Failed to save response: ' + error.message);
  }
}

/**
 * ガチャ設定を取得
 */
function getGachaConfig() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.GACHA_CONFIG);
    
    // シートが存在しない場合は作成してデフォルトデータを設定
    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.GACHA_CONFIG);
      // ヘッダーとデフォルトデータを設定
      const defaultData = [
        ['賞品名', '画像', 'レア度', '説明', '確率(%)'],
        ['京都タワー展望券', '🏯', 'レア', '京都タワーの展望台無料券をゲット！', 10],
        ['SANDO バル 500円クーポン', '🍜', 'ノーマル', '地下フードコートで使える500円分のクーポン！', 30],
        ['京都タワーオリジナルグッズ', '🎁', 'レア', '限定オリジナルグッズをプレゼント！', 15],
        ['SANDO バル ドリンク無料券', '🥤', 'ノーマル', 'お好きなドリンク1杯無料！', 25],
        ['京都タワー フォトスポット特典', '📸', 'ノーマル', 'インスタ映えスポットでの撮影特典！', 20]
      ];
      
      sheet.getRange(1, 1, defaultData.length, defaultData[0].length).setValues(defaultData);
      sheet.getRange(1, 1, 1, defaultData[0].length).setFontWeight('bold');
    }
    
    // データを取得
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const prizes = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { // 賞品名が空でない場合
        prizes.push({
          name: row[0],
          image: row[1],
          rarity: row[2],
          description: row[3],
          probability: parseFloat(row[4]) || 0
        });
      }
    }
    
    return createResponse(true, 'Gacha config retrieved successfully', { prizes });
    
  } catch (error) {
    console.error('Error getting gacha config:', error);
    return createResponse(false, 'Failed to get gacha config: ' + error.message);
  }
}

/**
 * 翻訳データを取得
 */
function getTranslations() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.TRANSLATIONS);
    
    // シートが存在しない場合は作成してデフォルトデータを設定
    if (!sheet) {
      sheet = ss.insertSheet(SHEETS.TRANSLATIONS);
      
      // デフォルトの翻訳データを設定（サンプル）
      const defaultData = [
        ['キー', '日本語', '英語', 'フランス語', '中国語', '韓国語', 'ベトナム語', 'インドネシア語'],
        ['title', '京都タワー SANDO バル', 'Kyoto Tower SANDO Bar', 'Tour de Kyoto SANDO Bar', '京都塔 SANDO 酒吧', '교토타워 SANDO 바', 'Tháp Kyoto SANDO Bar', 'Menara Kyoto SANDO Bar'],
        ['subtitle', 'アンケートに答えてガチャを回そう！', 'Answer the survey and spin the gacha!', 'Répondez au sondage et tournez le gacha !', '回答问卷并转动扭蛋！', '설문에 답하고 가챠를 돌려보세요!', 'Trả lời khảo sát và quay gacha!', 'Jawab survei dan putar gacha!'],
        ['question1', '1. どこの出身ですか？', '1. Where are you from?', '1. D\'où venez-vous ?', '1. 您来自哪里？', '1. 어디 출신이신가요?', '1. Bạn đến từ đâu?', '1. Anda berasal dari mana?'],
        ['submitButton', '送信してガチャ！', 'Submit and Gacha!', 'Soumettre et Gacha !', '提交并扭蛋！', '제출하고 가챠!', 'Gửi và Gacha!', 'Kirim dan Gacha!'],
        ['validationMessage', 'すべての項目を入力してください。', 'Please fill in all fields.', 'Veuillez remplir tous les champs.', '请填写所有字段。', '모든 항목을 입력해주세요.', 'Vui lòng điền vào tất cả các trường.', 'Silakan isi semua bidang.']
      ];
      
      sheet.getRange(1, 1, defaultData.length, defaultData[0].length).setValues(defaultData);
      sheet.getRange(1, 1, 1, defaultData[0].length).setFontWeight('bold');
    }
    
    // データを取得して翻訳オブジェクトを構築
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const translations = {};
    
    // 言語コードのマッピング
    const langMapping = {
      '日本語': 'ja',
      '英語': 'en', 
      'フランス語': 'fr',
      '中国語': 'zh',
      '韓国語': 'ko',
      'ベトナム語': 'vi',
      'インドネシア語': 'id'
    };
    
    // 各言語の翻訳オブジェクトを初期化
    Object.values(langMapping).forEach(code => {
      translations[code] = {};
    });
    
    // データを処理
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const key = row[0];
      
      if (key) {
        for (let j = 1; j < headers.length; j++) {
          const langName = headers[j];
          const langCode = langMapping[langName];
          
          if (langCode && row[j]) {
            translations[langCode][key] = row[j];
          }
        }
      }
    }
    
    return createResponse(true, 'Translations retrieved successfully', { translations });
    
  } catch (error) {
    console.error('Error getting translations:', error);
    return createResponse(false, 'Failed to get translations: ' + error.message);
  }
}

/**
 * レスポンスオブジェクトを作成
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * スプレッドシート初期化（手動実行用）
 */
function initializeSpreadsheet() {
  try {
    console.log('Initializing spreadsheet...');
    
    // 各API エンドポイントを呼び出してシートを作成
    saveResponse({
      responses: {
        origin: 'テストデータ',
        how_know: 'テスト',
        research_before: 'テスト',
        research_after: 'テスト'
      },
      language: 'ja'
    });
    
    getGachaConfig();
    getTranslations();
    
    console.log('Spreadsheet initialized successfully');
    
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
  }
}
```

---

## ステップ4️⃣ : スプレッドシートIDを設定

### 4-1. IDを設定
1. コードの3行目を探してください：
   ```javascript
   const SPREADSHEET_ID = 'あなたのスプレッドシートIDをここに貼り付け';
   ```
2. `あなたのスプレッドシートIDをここに貼り付け` の部分を、**ステップ1-4でメモしたID**に置き換えてください
3. 例：
   ```javascript
   const SPREADSHEET_ID = '1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ0';
   ```

### 4-2. 保存
1. Ctrl+S（またはCmd+S）で保存してください

---

## ステップ5️⃣ : 初回実行と権限設定

### 5-1. 関数を実行
1. エディター上部で `initializeSpreadsheet` 関数を選択
2. 「実行」ボタン（▶️）をクリック

### 5-2. 権限を承認（重要！）
初回実行時には以下の画面が表示されます：

1. **「承認が必要」ダイアログが表示**
   - 「権限を確認」ボタンをクリック

2. **Googleアカウント選択画面**
   - 使用するGoogleアカウントを選択

3. **警告画面が表示される場合**
   - 「詳細」をクリック
   - 「京都タワー アンケート API（安全ではないページ）に移動」をクリック
   - ⚠️ これは自分で作成したスクリプトなので安全です

4. **権限の確認画面**
   - 「許可」ボタンをクリック

### 5-3. 実行完了の確認
1. 下部の「実行ログ」タブをクリック
2. 「Initializing spreadsheet...」と「Spreadsheet initialized successfully」が表示されればOK

---

## ステップ6️⃣ : Webアプリとしてデプロイ

### 6-1. デプロイ設定
1. 右上の「デプロイ」ボタンをクリック
2. 「新しいデプロイ」を選択

### 6-2. デプロイ種類を選択
1. 左側の「種類」で歯車アイコンをクリック
2. 「ウェブアプリ」を選択

### 6-3. デプロイ設定を入力
以下の設定を行ってください：

- **説明**: `京都タワー アンケート API`
- **実行ユーザー**: `自分` を選択
- **アクセスできるユーザー**: `全員` を選択

### 6-4. デプロイ実行
1. 「デプロイ」ボタンをクリック
2. 再度権限確認が必要な場合は、ステップ5-2と同様に承認してください

### 6-5. WebアプリURLを取得
1. デプロイ完了後、「ウェブアプリ」のURLが表示されます
2. **このURLを必ずコピーしてメモ帳に保存してください**
3. 例：`https://script.google.com/macros/s/ABC...XYZ/exec`

デプロイID
AKfycbw593RB4kx3nbQXiSzpjpw7VvT2-U3d6usKT7OZL-erRFSN_a6GdtwlRNd5Ag0U0RHomA

ウェブアプリ
https://script.google.com/macros/s/AKfycbw593RB4kx3nbQXiSzpjpw7VvT2-U3d6usKT7OZL-erRFSN_a6GdtwlRNd5Ag0U0RHomA/exec
---

## ⭐ ここまでで完了です！

この時点で：
✅ Googleスプレッドシートが作成された
✅ Apps Scriptが設定された  
✅ WebアプリURLが取得できた

次は、WebアプリのHTMLファイルにこのURLを設定すれば連携完了です！

---

## 🔄 次のステップ

WebアプリURLが取得できましたら、私にお知らせください。
HTMLファイルにURLを設定して、実際に動作テストを行います。

---

## ❓ トラブルシューティング

### よくある問題と解決方法

**Q: 「権限が必要」の画面が表示され続ける**
A: ブラウザでポップアップブロックが有効になっている可能性があります。ポップアップを許可してください。

**Q: 「関数が見つかりません」エラー**
A: コードが正しく貼り付けられていない可能性があります。ステップ3をもう一度確認してください。

**Q: スプレッドシートIDエラー**
A: ステップ4でIDの設定が間違っている可能性があります。シングルクォート（'）で囲まれているか確認してください。

**Q: 実行ログにエラーが表示される**
A: エラーメッセージをそのままお知らせください。詳しく調査いたします。

---

## 📞 困った時は

どのステップでつまずいても大丈夫です！
- エラーメッセージのスクリーンショット
- どこまで進んだか
- 何をクリックしたか

をお知らせいただければ、一緒に解決いたします。