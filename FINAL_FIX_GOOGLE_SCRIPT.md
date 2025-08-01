# 🚨 最終修正：Google Apps Script GET方式対応

## 🔍 問題の特定
ネットワークタブから以下の問題が判明：
- ❌ **CORS error** - POSTリクエストでCORSが解決できない
- ❌ **405 Method Not Allowed** - OPTIONSプリフライトが失敗
- 🔧 **解決策**: GET方式に完全移行

---

## 🚀 【緊急】Google Apps Script 最終修正版

### ステップ1️⃣：Apps Scriptを開く
1. [Google Apps Script](https://script.google.com) にアクセス
2. 「京都タワー アンケート API」プロジェクトを開く

### ステップ2️⃣：全コード置き換え

**⚠️ 重要：以下のコードで全て置き換えてください**

```javascript
// 京都タワー SANDO バル アンケートアプリ - Google Apps Script（GET方式完全対応版）

// スプレッドシートID
const SPREADSHEET_ID = '1QMnM8rq728H1darm5dSRxHDzd_CKGV63EH-Fp8r9-Ts';

// シート名
const SHEETS = {
  RESPONSES: '回答データ',
  GACHA_CONFIG: 'ガチャ設定',
  TRANSLATIONS: '翻訳データ'
};

/**
 * GET リクエスト対応（CORS完全回避版）
 */
function doGet(e) {
  try {
    console.log('=== doGet called ===');
    console.log('Parameters:', JSON.stringify(e.parameter, null, 2));
    
    const action = e.parameter.action;
    console.log('Action:', action);
    
    let result;
    switch (action) {
      case 'saveResponse':
        result = saveResponseFromGet(e.parameter);
        break;
      case 'getGachaConfig':
        result = getGachaConfig();
        break;
      case 'getTranslations':
        result = getTranslations();
        break;
      default:
        console.log('Default action - API health check');
        result = createResponse(true, 'API is working - GET method');
    }
    
    console.log('=== doGet completed successfully ===');
    return result;
    
  } catch (error) {
    console.error('=== doGet ERROR ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * POST リクエスト（バックアップ用）
 */
function doPost(e) {
  console.log('doPost called (fallback)');
  return createResponse(false, 'Please use GET method instead');
}

/**
 * GET パラメータからアンケート回答を保存
 */
function saveResponseFromGet(params) {
  try {
    console.log('=== saveResponseFromGet started ===');
    console.log('Raw params:', JSON.stringify(params, null, 2));
    
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
    
    // パラメータからデータを解析
    let responses = {};
    if (params.responses) {
      try {
        responses = JSON.parse(params.responses);
        console.log('Parsed responses:', responses);
      } catch (parseError) {
        console.error('Failed to parse responses JSON:', parseError);
        responses = {};
      }
    }
    
    // データを追加
    const timestamp = new Date();
    const newRow = [
      timestamp,
      responses.origin || params.origin || '',
      responses.how_know || params.how_know || '',
      responses.research_before || params.research_before || '',
      responses.research_after || params.research_after || '',
      params.language || 'ja',
      params.ip || 'unknown'
    ];
    
    console.log('Adding row:', JSON.stringify(newRow));
    sheet.appendRow(newRow);
    
    const rowNumber = sheet.getLastRow();
    console.log('Row added at position:', rowNumber);
    
    console.log('=== saveResponseFromGet completed successfully ===');
    
    return createResponse(true, 'Response saved successfully', {
      timestamp: timestamp.toISOString(),
      rowNumber: rowNumber,
      data: newRow
    });
    
  } catch (error) {
    console.error('=== saveResponseFromGet ERROR ===');
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
 * レスポンスオブジェクトを作成（シンプル版）
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
  
  // GET方式はシンプルなレスポンス（CORSヘッダー不要）
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 手動テスト用関数
 */
function manualTest() {
  console.log('=== Manual Test Started ===');
  
  // GET方式のテスト
  const testParams = {
    action: 'saveResponse',
    responses: JSON.stringify({
      origin: '手動テスト（GET方式）',
      how_know: 'インターネット検索',
      research_before: 'Google検索',
      research_after: 'Google マップ'
    }),
    language: 'ja',
    ip: 'manual-test-get'
  };
  
  const result = saveResponseFromGet(testParams);
  console.log('Manual test result:', result);
  console.log('=== Manual Test Completed ===');
  
  return result;
}

/**
 * スプレッドシート初期化（手動実行用）
 */
function initializeSpreadsheet() {
  try {
    console.log('=== Initializing spreadsheet ===');
    
    // 各シートを作成
    getGachaConfig();
    getTranslations();
    
    // テストデータを保存
    const testResult = manualTest();
    console.log('Test save completed:', testResult);
    
    console.log('=== Spreadsheet initialization completed ===');
    
  } catch (error) {
    console.error('=== Spreadsheet initialization ERROR ===');
    console.error('Error details:', error);
  }
}
```

### ステップ3️⃣：保存と再デプロイ
1. **Ctrl+S** (Mac: Cmd+S) で保存
2. **「デプロイ」** → **「デプロイを管理」**
3. 鉛筆アイコン（編集）をクリック
4. **「バージョン」** で **「新バージョン」** を選択
5. **「デプロイ」** をクリック

### ステップ4️⃣：テスト実行
1. エディターで **`manualTest`** 関数を選択
2. **「実行」** ボタンをクリック
3. ログで成功メッセージを確認

---

## 🎯 この修正のポイント

### ✅ CORS問題の完全解決：
- GET方式によりプリフライトリクエスト不要
- シンプルリクエストでCORS回避

### ✅ データ送信方式の改善：
- URLパラメータでデータ送信
- JSON解析によるデータ復元

### ✅ エラーハンドリング強化：
- 詳細ログ出力
- フォールバック処理

---

## 📊 期待される結果

### 成功時：
- ✅ CORS エラーが解消
- ✅ 405 エラーが解消
- ✅ アンケートデータがスプレッドシートに保存

### 確認方法：
1. GitHub Pages でアンケート送信
2. Console で「✅ スプレッドシート保存成功」を確認
3. スプレッドシートで新しい行を確認