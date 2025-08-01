# 🔧 CORS問題修正：Google Apps Script更新手順

## 問題の原因
GitHub Pages（https://TTH15.github.io/kyoto-tower/）からGoogle Apps ScriptにAPIリクエストを送信する際、**CORS（Cross-Origin Resource Sharing）エラー**が発生している可能性があります。

## 🚀 修正手順

### ステップ1️⃣：Apps Scriptエディターを開く
1. [Google Apps Script](https://script.google.com) にアクセス
2. 「京都タワー アンケート API」プロジェクトを開く

### ステップ2️⃣：既存のコードを新しいバージョンに置き換え

**以下のコードをコピーして、既存のコードと全て置き換えてください：**

```javascript
// 京都タワー SANDO バル アンケートアプリ - Google Apps Script（CORS対応版）

// スプレッドシートID
const SPREADSHEET_ID = '1QMnM8rq728H1darm5dSRxHDzd_CKGV63EH-Fp8r9-Ts';

// シート名
const SHEETS = {
  RESPONSES: '回答データ',
  GACHA_CONFIG: 'ガチャ設定',
  TRANSLATIONS: '翻訳データ'
};

/**
 * Web App のメインエントリーポイント（CORS対応）
 */
function doPost(e) {
  try {
    // リクエストログを記録
    console.log('doPost called with:', e);
    console.log('postData:', e.postData);
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    console.log('Action:', action);
    console.log('Data:', data);
    
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
 * OPTIONS リクエスト対応（CORS プリフライト）
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
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
    console.log('saveResponse called with data:', data);
    
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
    
    console.log('Adding row:', newRow);
    sheet.appendRow(newRow);
    
    console.log('Response saved successfully');
    
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
 * レスポンスオブジェクトを作成（CORS対応）
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
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
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

### ステップ3️⃣：保存と再デプロイ
1. **Ctrl+S** (または Cmd+S) で保存
2. **「デプロイ」** → **「デプロイを管理」** をクリック
3. 右上の **鉛筆アイコン（編集）** をクリック
4. **「バージョン」** で **「新バージョン」** を選択
5. **「デプロイ」** をクリック

### ステップ4️⃣：動作テスト
1. GitHub Pages のアプリでアンケートに回答
2. 送信ボタンをクリック
3. スプレッドシートに新しいデータが記録されるか確認

## 🔍 修正内容

### 追加された機能：
- **CORS対応**: GitHub Pagesからのリクエストを許可
- **詳細ログ**: デバッグ用のログ出力
- **プリフライト対応**: OPTIONSリクエストへの対応

この修正により、CORS エラーが解決されるはずです！