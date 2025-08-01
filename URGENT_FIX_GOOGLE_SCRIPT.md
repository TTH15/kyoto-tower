# 🚨 緊急修正：Google Apps Script 更新手順

## 📋 現在の状況
- ✅ フロントエンドにデバッグ機能追加済み
- ❌ アンケートデータが記録されない
- 🔧 Google Apps Scriptの更新が必要

## 🚀 【重要】Google Apps Script 更新手順

### 手順1️⃣：Apps Scriptを開く
1. [Google Apps Script](https://script.google.com) にアクセス
2. 「京都タワー アンケート API」プロジェクトを開く

### 手順2️⃣：既存コードを全て削除して置き換え

**⚠️ 重要：既存のコードを全て選択（Ctrl+A）して削除し、以下のコードを貼り付けてください**

```javascript
// 京都タワー SANDO バル アンケートアプリ - Google Apps Script（CORS対応版 v2.0）

// スプレッドシートID
const SPREADSHEET_ID = '1QMnM8rq728H1darm5dSRxHDzd_CKGV63EH-Fp8r9-Ts';

// シート名
const SHEETS = {
  RESPONSES: '回答データ',
  GACHA_CONFIG: 'ガチャ設定',
  TRANSLATIONS: '翻訳データ'
};

/**
 * Web App のメインエントリーポイント（CORS対応 v2.0）
 */
function doPost(e) {
  try {
    // リクエストログを記録
    console.log('=== doPost called ===');
    console.log('Headers:', JSON.stringify(e));
    console.log('PostData:', e.postData);
    
    if (!e.postData || !e.postData.contents) {
      console.error('No postData.contents found');
      return createResponse(false, 'No data received');
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    console.log('Action:', action);
    console.log('Parsed Data:', JSON.stringify(data, null, 2));
    
    let result;
    switch (action) {
      case 'saveResponse':
        result = saveResponse(data);
        break;
      case 'getGachaConfig':
        result = getGachaConfig();
        break;
      case 'getTranslations':
        result = getTranslations();
        break;
      default:
        console.error('Invalid action:', action);
        result = createResponse(false, 'Invalid action: ' + action);
    }
    
    console.log('=== doPost completed successfully ===');
    return result;
    
  } catch (error) {
    console.error('=== doPost ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * OPTIONS リクエスト対応（CORS プリフライト）
 */
function doOptions(e) {
  console.log('doOptions called');
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
  console.log('doGet called with parameters:', e.parameter);
  
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'getGachaConfig':
        return getGachaConfig();
      case 'getTranslations':
        return getTranslations();
      default:
        return createResponse(true, 'API is working - GET request received');
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
    console.log('=== saveResponse started ===');
    console.log('Input data:', JSON.stringify(data, null, 2));
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    let sheet = ss.getSheetByName(SHEETS.RESPONSES);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      console.log('Creating new response sheet');
      sheet = ss.insertSheet(SHEETS.RESPONSES);
      
      // ヘッダー行を設定
      const headers = [
        'タイムスタンプ', '出身', 'SANDO バルを知った方法', 
        '来日前のリサーチ方法', '来日後のリサーチ方法', '言語', 'IPアドレス'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      console.log('Headers set:', headers);
    }
    
    // データを追加
    const timestamp = new Date();
    const responses = data.responses || {};
    
    const newRow = [
      timestamp,
      responses.origin || '',
      responses.how_know || '',
      responses.research_before || '',
      responses.research_after || '',
      data.language || 'ja',
      data.ip || 'unknown'
    ];
    
    console.log('Adding row:', JSON.stringify(newRow));
    sheet.appendRow(newRow);
    
    const rowNumber = sheet.getLastRow();
    console.log('Row added at position:', rowNumber);
    
    console.log('=== saveResponse completed successfully ===');
    
    return createResponse(true, 'Response saved successfully', {
      timestamp: timestamp.toISOString(),
      rowNumber: rowNumber,
      data: newRow
    });
    
  } catch (error) {
    console.error('=== saveResponse ERROR ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return createResponse(false, 'Failed to save response: ' + error.message);
  }
}

/**
 * ガチャ設定を取得
 */
function getGachaConfig() {
  try {
    console.log('getGachaConfig started');
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.GACHA_CONFIG);
    
    // シートが存在しない場合は作成してデフォルトデータを設定
    if (!sheet) {
      console.log('Creating gacha config sheet');
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
    
    console.log('Gacha config retrieved:', prizes.length, 'prizes');
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
    console.log('getTranslations started');
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEETS.TRANSLATIONS);
    
    // シートが存在しない場合は作成してデフォルトデータを設定
    if (!sheet) {
      console.log('Creating translations sheet');
      sheet = ss.insertSheet(SHEETS.TRANSLATIONS);
      
      // デフォルトの翻訳データを設定
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
        for (let j = 1; j < data[0].length; j++) {
          const langName = data[0][j];
          const langCode = langMapping[langName];
          
          if (langCode && row[j]) {
            translations[langCode][key] = row[j];
          }
        }
      }
    }
    
    console.log('Translations retrieved for languages:', Object.keys(translations));
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
  
  console.log('Creating response:', JSON.stringify(response, null, 2));
  
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
    console.log('=== Initializing spreadsheet ===');
    
    // テストデータで各エンドポイントを確認
    const testSaveResult = saveResponse({
      responses: {
        origin: 'テストデータ（初期化）',
        how_know: 'テスト',
        research_before: 'テスト',
        research_after: 'テスト'
      },
      language: 'ja',
      ip: 'initialization'
    });
    console.log('Test save result:', testSaveResult);
    
    const testGachaResult = getGachaConfig();
    console.log('Test gacha result:', testGachaResult);
    
    const testTranslationsResult = getTranslations();
    console.log('Test translations result:', testTranslationsResult);
    
    console.log('=== Spreadsheet initialization completed ===');
    
  } catch (error) {
    console.error('=== Spreadsheet initialization ERROR ===');
    console.error('Error details:', error);
  }
}

/**
 * 手動テスト用関数
 */
function manualTest() {
  console.log('=== Manual Test Started ===');
  
  // saveResponse のテスト
  const testData = {
    action: 'saveResponse',
    responses: {
      origin: '手動テスト',
      how_know: 'インターネット検索',
      research_before: 'Google検索',
      research_after: 'Google マップ'
    },
    language: 'ja',
    ip: 'manual-test'
  };
  
  const result = saveResponse(testData);
  console.log('Manual test result:', result);
  console.log('=== Manual Test Completed ===');
  
  return result;
}
```

### 手順3️⃣：保存と再デプロイ
1. **Ctrl+S** (Mac: Cmd+S) で保存
2. **「デプロイ」** → **「デプロイを管理」**
3. 鉛筆アイコン（編集）をクリック
4. **「バージョン」** で **「新バージョン」** を選択
5. **「デプロイ」** をクリック

### 手順4️⃣：テスト実行
1. エディターで **`manualTest`** 関数を選択
2. **「実行」** ボタンをクリック
3. ログを確認して成功するかチェック

---

## 🎯 5分後にテスト

更新後、約5分で以下をテストしてください：

1. **GitHub Pages** のアプリを開く: https://TTH15.github.io/kyoto-tower/
2. **F12** でConsoleを開く
3. **デバッグメッセージ** を確認
4. **アンケート送信** をテスト
5. **スプレッドシート** にデータが追加されるか確認

## 🔧 期待される結果

### 成功時：
- ✅ ページ上部に「✅ 基本接続 成功」などのメッセージ
- ✅ アンケート送信後に「✅ スプレッドシート保存成功」
- ✅ スプレッドシートに新しい行が追加

### 失敗時：
- ❌ 「❌ 接続テスト失敗」メッセージ
- ❌ Console にエラーメッセージ

失敗した場合は、エラーメッセージを教えてください！