// 京都タワー SANDO バル アンケートアプリ - Google スプレッドシート連携版

// Google Apps Script Web App URL
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw593RB4kx3nbQXiSzpjpw7VvT2-U3d6usKT7OZL-erRFSN_a6GdtwlRNd5Ag0U0RHomA/exec';

// デバッグモード
const DEBUG_MODE = true;

// 多言語翻訳データ（スプレッドシートから取得予定、フォールバック用）
const translations = {
    ja: {
        title: "京都タワー SANDO バル",
        subtitle: "アンケートに答えてガチャを回そう！",
        question1: "1. どこの出身ですか？",
        placeholder1: "例：東京、大阪、韓国、アメリカ等",
        question2: "2. 京都タワーの地下のフードコート「SANDO バル」を何で知りましたか？",
        question3: "3. 日本に来る「前」に、どのように訪問先についてリサーチしましたか？",
        question4: "4. 日本に来た「後」、滞在中には、どのように訪問先についてリサーチしていますか？",
        selectOption: "選択してください",
        option2_1: "インターネット検索",
        option2_2: "SNS（Instagram、Twitter等）",
        option2_3: "旅行ガイドブック",
        option2_4: "友人・知人の紹介",
        option2_5: "京都タワーの案内",
        option2_6: "偶然見つけた",
        option2_7: "その他",
        option3_1: "Google検索",
        option3_2: "旅行サイト（じゃらん、楽天トラベル等）",
        option3_3: "SNS（Instagram、TikTok等）",
        option3_4: "YouTube",
        option3_5: "旅行ガイドブック",
        option3_6: "旅行会社",
        option3_7: "友人・知人に相談",
        option3_8: "特にリサーチしなかった",
        option4_1: "Google マップ",
        option4_2: "Google 検索",
        option4_3: "SNS（Instagram、TikTok等）",
        option4_4: "旅行アプリ",
        option4_5: "ホテルの案内",
        option4_6: "観光案内所",
        option4_7: "現地の人に聞く",
        option4_8: "特にリサーチしていない",
        submitButton: "送信してガチャ！",
        validationMessage: "すべての項目を入力してください。",
        gachaLoading: "ガチャを回しています...",
        gachaCongrats: "おめでとうございます！",
        gachaInstruction: "※この画面をスタッフにお見せください"
    },
    en: {
        title: "Kyoto Tower SANDO Bar",
        subtitle: "Answer the survey and spin the gacha!",
        question1: "1. Where are you from?",
        placeholder1: "Example: Tokyo, Osaka, Korea, America, etc.",
        question2: "2. How did you hear about 'SANDO Bar', the food court in the basement of Kyoto Tower?",
        question3: "3. How did you research your travel destinations 'before' coming to Japan?",
        question4: "4. How do you research travel destinations 'after' coming to Japan during your stay?",
        selectOption: "Please select",
        option2_1: "Internet search",
        option2_2: "SNS (Instagram, Twitter, etc.)",
        option2_3: "Travel guidebook",
        option2_4: "Friends/acquaintances recommendation",
        option2_5: "Kyoto Tower information",
        option2_6: "Found by chance",
        option2_7: "Other",
        option3_1: "Google search",
        option3_2: "Travel websites (Jalan, Rakuten Travel, etc.)",
        option3_3: "SNS (Instagram, TikTok, etc.)",
        option3_4: "YouTube",
        option3_5: "Travel guidebook",
        option3_6: "Travel agency",
        option3_7: "Consulted friends/acquaintances",
        option3_8: "Did no research",
        option4_1: "Google Maps",
        option4_2: "Google search",
        option4_3: "SNS (Instagram, TikTok, etc.)",
        option4_4: "Travel apps",
        option4_5: "Hotel information",
        option4_6: "Tourist information center",
        option4_7: "Ask locals",
        option4_8: "No research",
        submitButton: "Submit and Gacha!",
        validationMessage: "Please fill in all fields.",
        gachaLoading: "Rolling gacha...",
        gachaCongrats: "Congratulations!",
        gachaInstruction: "※Please show this screen to staff"
    },
    fr: {
        title: "Tour de Kyoto SANDO Bar",
        subtitle: "Répondez au sondage et tournez le gacha !",
        question1: "1. D'où venez-vous ?",
        placeholder1: "Exemple : Tokyo, Osaka, Corée, Amérique, etc.",
        question2: "2. Comment avez-vous entendu parler du 'SANDO Bar', la cour de restauration au sous-sol de la Tour de Kyoto ?",
        question3: "3. Comment avez-vous recherché vos destinations de voyage 'avant' de venir au Japon ?",
        question4: "4. Comment recherchez-vous les destinations de voyage 'après' être venu au Japon pendant votre séjour ?",
        selectOption: "Veuillez sélectionner",
        option2_1: "Recherche internet",
        option2_2: "Réseaux sociaux (Instagram, Twitter, etc.)",
        option2_3: "Guide de voyage",
        option2_4: "Recommandation d'amis/connaissances",
        option2_5: "Information de la Tour de Kyoto",
        option2_6: "Trouvé par hasard",
        option2_7: "Autre",
        option3_1: "Recherche Google",
        option3_2: "Sites de voyage (Jalan, Rakuten Travel, etc.)",
        option3_3: "Réseaux sociaux (Instagram, TikTok, etc.)",
        option3_4: "YouTube",
        option3_5: "Guide de voyage",
        option3_6: "Agence de voyage",
        option3_7: "Consulté des amis/connaissances",
        option3_8: "Aucune recherche",
        option4_1: "Google Maps",
        option4_2: "Recherche Google",
        option4_3: "Réseaux sociaux (Instagram, TikTok, etc.)",
        option4_4: "Applications de voyage",
        option4_5: "Information de l'hôtel",
        option4_6: "Office de tourisme",
        option4_7: "Demander aux locaux",
        option4_8: "Aucune recherche",
        submitButton: "Soumettre et Gacha !",
        validationMessage: "Veuillez remplir tous les champs.",
        gachaLoading: "Tournage du gacha...",
        gachaCongrats: "Félicitations !",
        gachaInstruction: "※Veuillez montrer cet écran au personnel"
    },
    zh: {
        title: "京都塔 SANDO 酒吧",
        subtitle: "回答问卷并转动扭蛋！",
        question1: "1. 您来自哪里？",
        placeholder1: "例如：东京、大阪、韩国、美国等",
        question2: "2. 您是如何了解京都塔地下美食广场'SANDO 酒吧'的？",
        question3: "3. 来日本'之前'，您是如何研究旅游目的地的？",
        question4: "4. 来到日本'之后'，在逗留期间您是如何研究旅游目的地的？",
        selectOption: "请选择",
        option2_1: "网络搜索",
        option2_2: "社交媒体（Instagram、Twitter等）",
        option2_3: "旅游指南书",
        option2_4: "朋友/熟人推荐",
        option2_5: "京都塔信息",
        option2_6: "偶然发现",
        option2_7: "其他",
        option3_1: "Google搜索",
        option3_2: "旅游网站（Jalan、乐天旅行等）",
        option3_3: "社交媒体（Instagram、TikTok等）",
        option3_4: "YouTube",
        option3_5: "旅游指南书",
        option3_6: "旅行社",
        option3_7: "咨询朋友/熟人",
        option3_8: "没有做研究",
        option4_1: "Google地图",
        option4_2: "Google搜索",
        option4_3: "社交媒体（Instagram、TikTok等）",
        option4_4: "旅行应用",
        option4_5: "酒店信息",
        option4_6: "旅游信息中心",
        option4_7: "询问当地人",
        option4_8: "没有研究",
        submitButton: "提交并扭蛋！",
        validationMessage: "请填写所有字段。",
        gachaLoading: "正在转动扭蛋...",
        gachaCongrats: "恭喜您！",
        gachaInstruction: "※请向工作人员出示此屏幕"
    },
    ko: {
        title: "교토타워 SANDO 바",
        subtitle: "설문에 답하고 가챠를 돌려보세요!",
        question1: "1. 어디 출신이신가요?",
        placeholder1: "예: 도쿄, 오사카, 한국, 미국 등",
        question2: "2. 교토타워 지하 푸드코트 'SANDO 바'를 어떻게 알게 되셨나요?",
        question3: "3. 일본에 오기 '전'에 여행지에 대해 어떻게 리서치하셨나요?",
        question4: "4. 일본에 온 '후' 체류 중에는 여행지에 대해 어떻게 리서치하고 계신가요?",
        selectOption: "선택해주세요",
        option2_1: "인터넷 검색",
        option2_2: "SNS (Instagram, Twitter 등)",
        option2_3: "여행 가이드북",
        option2_4: "친구/지인 추천",
        option2_5: "교토타워 안내",
        option2_6: "우연히 발견",
        option2_7: "기타",
        option3_1: "Google 검색",
        option3_2: "여행 사이트 (Jalan, 라쿠텐 트래블 등)",
        option3_3: "SNS (Instagram, TikTok 등)",
        option3_4: "YouTube",
        option3_5: "여행 가이드북",
        option3_6: "여행사",
        option3_7: "친구/지인 상담",
        option3_8: "특별히 리서치하지 않음",
        option4_1: "Google 지도",
        option4_2: "Google 검색",
        option4_3: "SNS (Instagram, TikTok 등)",
        option4_4: "여행 앱",
        option4_5: "호텔 안내",
        option4_6: "관광 안내소",
        option4_7: "현지인에게 문의",
        option4_8: "특별히 리서치하지 않음",
        submitButton: "제출하고 가챠!",
        validationMessage: "모든 항목을 입력해주세요.",
        gachaLoading: "가챠를 돌리고 있습니다...",
        gachaCongrats: "축하합니다!",
        gachaInstruction: "※이 화면을 스태프에게 보여주세요"
    },
    vi: {
        title: "Tháp Kyoto SANDO Bar",
        subtitle: "Trả lời khảo sát và quay gacha!",
        question1: "1. Bạn đến từ đâu?",
        placeholder1: "Ví dụ: Tokyo, Osaka, Hàn Quốc, Mỹ, v.v.",
        question2: "2. Bạn biết đến 'SANDO Bar', khu ẩm thực tầng hầm của Tháp Kyoto như thế nào?",
        question3: "3. 'Trước' khi đến Nhật Bản, bạn đã nghiên cứu các điểm du lịch như thế nào?",
        question4: "4. 'Sau' khi đến Nhật Bản, trong thời gian lưu trú, bạn nghiên cứu các điểm du lịch như thế nào?",
        selectOption: "Vui lòng chọn",
        option2_1: "Tìm kiếm internet",
        option2_2: "Mạng xã hội (Instagram, Twitter, v.v.)",
        option2_3: "Sách hướng dẫn du lịch",
        option2_4: "Giới thiệu của bạn bè/người quen",
        option2_5: "Thông tin từ Tháp Kyoto",
        option2_6: "Tìm thấy tình cờ",
        option2_7: "Khác",
        option3_1: "Tìm kiếm Google",
        option3_2: "Trang web du lịch (Jalan, Rakuten Travel, v.v.)",
        option3_3: "Mạng xã hội (Instagram, TikTok, v.v.)",
        option3_4: "YouTube",
        option3_5: "Sách hướng dẫn du lịch",
        option3_6: "Công ty du lịch",
        option3_7: "Tham khảo bạn bè/người quen",
        option3_8: "Không nghiên cứu đặc biệt",
        option4_1: "Google Maps",
        option4_2: "Tìm kiếm Google",
        option4_3: "Mạng xã hội (Instagram, TikTok, v.v.)",
        option4_4: "Ứng dụng du lịch",
        option4_5: "Thông tin khách sạn",
        option4_6: "Trung tâm thông tin du lịch",
        option4_7: "Hỏi người địa phương",
        option4_8: "Không nghiên cứu đặc biệt",
        submitButton: "Gửi và Gacha!",
        validationMessage: "Vui lòng điền vào tất cả các trường.",
        gachaLoading: "Đang quay gacha...",
        gachaCongrats: "Chúc mừng!",
        gachaInstruction: "※Vui lòng cho nhân viên xem màn hình này"
    },
    id: {
        title: "Menara Kyoto SANDO Bar",
        subtitle: "Jawab survei dan putar gacha!",
        question1: "1. Anda berasal dari mana?",
        placeholder1: "Contoh: Tokyo, Osaka, Korea, Amerika, dll.",
        question2: "2. Bagaimana Anda mengetahui 'SANDO Bar', food court di basement Menara Kyoto?",
        question3: "3. 'Sebelum' datang ke Jepang, bagaimana Anda meneliti destinasi perjalanan?",
        question4: "4. 'Setelah' datang ke Jepang, selama tinggal, bagaimana Anda meneliti destinasi perjalanan?",
        selectOption: "Silakan pilih",
        option2_1: "Pencarian internet",
        option2_2: "Media sosial (Instagram, Twitter, dll.)",
        option2_3: "Buku panduan wisata",
        option2_4: "Rekomendasi teman/kenalan",
        option2_5: "Informasi Menara Kyoto",
        option2_6: "Menemukan secara kebetulan",
        option2_7: "Lainnya",
        option3_1: "Pencarian Google",
        option3_2: "Situs perjalanan (Jalan, Rakuten Travel, dll.)",
        option3_3: "Media sosial (Instagram, TikTok, dll.)",
        option3_4: "YouTube",
        option3_5: "Buku panduan wisata",
        option3_6: "Agen perjalanan",
        option3_7: "Konsultasi teman/kenalan",
        option3_8: "Tidak melakukan riset khusus",
        option4_1: "Google Maps",
        option4_2: "Pencarian Google",
        option4_3: "Media sosial (Instagram, TikTok, dll.)",
        option4_4: "Aplikasi perjalanan",
        option4_5: "Informasi hotel",
        option4_6: "Pusat informasi wisata",
        option4_7: "Bertanya kepada penduduk lokal",
        option4_8: "Tidak melakukan riset khusus",
        submitButton: "Kirim dan Gacha!",
        validationMessage: "Silakan isi semua bidang.",
        gachaLoading: "Memutar gacha...",
        gachaCongrats: "Selamat!",
        gachaInstruction: "※Silakan tunjukkan layar ini kepada staff"
    }
};

// Google Apps Script との通信用関数（GET方式 - CORS回避版）
async function callGAS(action, data = {}) {
    try {
        if (DEBUG_MODE) {
            console.log('🚀 GAS API Call (GET方式):', {
                action: action,
                url: GAS_WEB_APP_URL,
                data: data
            });
        }

        // GETパラメータとしてデータを送信
        const params = new URLSearchParams({
            action: action,
            ...Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    typeof value === 'object' ? JSON.stringify(value) : String(value)
                ])
            )
        });

        const url = `${GAS_WEB_APP_URL}?${params.toString()}`;

        if (DEBUG_MODE) {
            console.log('📤 Request URL:', url);
        }

        const response = await fetch(url, {
            method: 'GET',
            // CORSヘッダーは送信しない（シンプルリクエスト）
        });

        if (DEBUG_MODE) {
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
        }

        if (!response.ok) {
            const errorText = await response.text();
            if (DEBUG_MODE) {
                console.error('❌ Response Error Text:', errorText);
            }
            throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
        }

        const result = await response.json();

        if (DEBUG_MODE) {
            console.log('✅ Response Data:', result);
        }

        if (!result.success) {
            throw new Error(result.message || 'API call failed');
        }

        return result.data;

    } catch (error) {
        console.error(`❌ GAS API Error (${action}):`, error);
        if (DEBUG_MODE) {
            console.error('Full error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        throw error;
    }
}

// 翻訳データとガチャ設定のキャッシュ
let translationsCache = null;
let gachaConfigCache = null;

// 翻訳データを取得（キャッシュあり）
async function getTranslations() {
    if (translationsCache) {
        return translationsCache;
    }

    try {
        const data = await callGAS('getTranslations');
        translationsCache = data.translations;
        console.log('翻訳データをスプレッドシートから取得しました');
        return translationsCache;
    } catch (error) {
        console.warn('スプレッドシートから翻訳データを取得できませんでした。フォールバックデータを使用します:', error);
        translationsCache = translations; // フォールバック
        return translationsCache;
    }
}

// ガチャ設定を取得（キャッシュあり）
async function getGachaConfig() {
    if (gachaConfigCache) {
        return gachaConfigCache;
    }

    try {
        const data = await callGAS('getGachaConfig');
        gachaConfigCache = data.prizes;
        console.log('ガチャ設定をスプレッドシートから取得しました');
        return gachaConfigCache;
    } catch (error) {
        console.warn('スプレッドシートからガチャ設定を取得できませんでした。デフォルト設定を使用します:', error);
        // デフォルトのガチャ設定
        gachaConfigCache = [
            {
                name: "京都タワー展望券",
                image: "🏯",
                rarity: "レア",
                description: "京都タワーの展望台無料券をゲット！",
                probability: 10
            },
            {
                name: "SANDO バル 500円クーポン",
                image: "🍜",
                rarity: "ノーマル",
                description: "地下フードコートで使える500円分のクーポン！",
                probability: 30
            },
            {
                name: "京都タワーオリジナルグッズ",
                image: "🎁",
                rarity: "レア",
                description: "限定オリジナルグッズをプレゼント！",
                probability: 15
            },
            {
                name: "SANDO バル ドリンク無料券",
                image: "🥤",
                rarity: "ノーマル",
                description: "お好きなドリンク1杯無料！",
                probability: 25
            },
            {
                name: "京都タワー フォトスポット特典",
                image: "📸",
                rarity: "ノーマル",
                description: "インスタ映えスポットでの撮影特典！",
                probability: 20
            }
        ];
        return gachaConfigCache;
    }
}

// アンケート回答を保存（デバッグ強化版）
async function saveResponse(responses, language) {
    try {
        if (DEBUG_MODE) {
            console.log('💾 Starting saveResponse:', { responses, language });
        }

        const result = await callGAS('saveResponse', {
            responses: JSON.stringify(responses),
            language: language,
            ip: 'unknown', // クライアントサイドではIPは取得できません
            timestamp: new Date().toISOString()
        });

        console.log('✅ アンケート回答をスプレッドシートに保存しました:', result);

        // 成功時の視覚的フィードバック
        if (DEBUG_MODE) {
            showDebugMessage('✅ スプレッドシート保存成功', 'success');
        }

    } catch (error) {
        console.error('❌ アンケート回答の保存に失敗しました:', error);

        // エラー時の視覚的フィードバック
        if (DEBUG_MODE) {
            showDebugMessage('❌ スプレッドシート保存失敗: ' + error.message, 'error');
        }

        // 保存に失敗してもガチャは実行する
    }
}

document.addEventListener('DOMContentLoaded', async function () {

    // 初期化ローディング表示
    showInitializationLoading();

    // 翻訳データとガチャ設定を並行して取得
    try {
        const [translationsData, gachaData] = await Promise.all([
            getTranslations(),
            getGachaConfig()
        ]);

        // 取得成功時の処理
        console.log('初期データの取得が完了しました');

    } catch (error) {
        console.error('初期データの取得中にエラーが発生しました:', error);
    } finally {
        hideInitializationLoading();
    }

    // デバッグモード時の接続テスト実行
    if (DEBUG_MODE) {
        console.log('🔧 Debug mode enabled');
        showDebugMessage('🔧 デバッグモード有効', 'info');

        // 5秒後に接続テストを実行
        setTimeout(() => {
            testConnection();
        }, 5000);
    }

    // 現在の言語（デフォルト：日本語）
    let currentLanguage = 'ja';

    // 言語切り替え機能
    const languageSelect = document.getElementById('language-select');

    // 言語を変更する関数
    async function changeLanguage(lang) {
        currentLanguage = lang;

        // スプレッドシートから取得した翻訳データを使用
        const translationsData = await getTranslations();
        const translation = translationsData[lang] || translationsData['ja'] || translations[lang] || translations['ja'];

        // data-lang属性を持つ要素を更新
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // プレースホルダーテキストを更新
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (translation[key]) {
                element.placeholder = translation[key];
            }
        });

        // HTMLのlang属性を更新
        document.documentElement.lang = lang;

        console.log(`言語を${lang}に変更しました`);
    }

    // 言語選択の変更イベント
    languageSelect.addEventListener('change', function () {
        changeLanguage(this.value);
    });

    // フォーム送信処理
    const form = document.getElementById('survey-form');
    const gachaResult = document.getElementById('gacha-result');
    const gachaImage = document.getElementById('gacha-image');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // フォームデータ取得
        const formData = new FormData(form);
        const responses = {};

        // データを整理
        for (let [key, value] of formData.entries()) {
            responses[key] = value;
        }

        // バリデーション
        if (!responses.origin || !responses.how_know || !responses.research_before || !responses.research_after) {
            const translationsData = translationsCache || translations;
            const translation = translationsData[currentLanguage] || translationsData['ja'] || translations[currentLanguage] || translations['ja'];
            alert(translation.validationMessage);
            return;
        }

        console.log('アンケート回答:', responses);

        // アンケート回答を保存（非同期）
        saveResponse(responses, currentLanguage);

        // ガチャ実行
        executeGacha();
    });

    // ガチャ機能
    async function executeGacha() {
        const translationsData = await getTranslations();
        const translation = translationsData[currentLanguage] || translationsData['ja'] || translations[currentLanguage] || translations['ja'];

        // ローディング表示
        gachaResult.style.display = 'block';
        gachaResult.innerHTML = `
            <div style="margin: 20px 0;">
                <div style="font-size: 2rem; margin-bottom: 16px;">🎲</div>
                <div>${translation.gachaLoading}</div>
            </div>
        `;

        try {
            // スプレッドシートからガチャ設定を取得
            const prizes = await getGachaConfig();

            // ガチャ演出（2秒後に結果表示）
            setTimeout(() => {
                const selectedPrize = selectPrizeByProbability(prizes);
                showGachaResult(selectedPrize);
            }, 2000);

        } catch (error) {
            console.error('ガチャ実行エラー:', error);
            // エラー時はデフォルトの結果を表示
            setTimeout(() => {
                const defaultPrize = {
                    name: "SANDO バル ドリンク無料券",
                    image: "🥤",
                    rarity: "ノーマル",
                    description: "お好きなドリンク1杯無料！"
                };
                showGachaResult(defaultPrize);
            }, 2000);
        }
    }

    // 確率に基づいた賞品選択
    function selectPrizeByProbability(prizes) {
        // 総確率を計算
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

        // ランダムな値を生成（0から総確率まで）
        const random = Math.random() * totalProbability;

        // 累積確率で賞品を選択
        let cumulativeProbability = 0;
        for (const prize of prizes) {
            cumulativeProbability += prize.probability;
            if (random <= cumulativeProbability) {
                return prize;
            }
        }

        // フォールバック（最後の賞品を返す）
        return prizes[prizes.length - 1];
    }

    // ガチャ結果表示
    async function showGachaResult(prize) {
        const translationsData = await getTranslations();
        const translation = translationsData[currentLanguage] || translationsData['ja'] || translations[currentLanguage] || translations['ja'];
        const rarityColor = prize.rarity === 'レア' ? '#FFD700' : '#87CEEB';

        gachaResult.innerHTML = `
            <div style="animation: bounceIn 0.6s ease-out;">
                <div style="font-size: 4rem; margin-bottom: 16px;">${prize.image}</div>
                <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 8px;">
                    ${translation.gachaCongrats}
                </div>
                <div style="background: ${rarityColor}; color: #333; padding: 4px 12px; border-radius: 12px; display: inline-block; font-size: 0.9rem; font-weight: 600; margin-bottom: 12px;">
                    ${prize.rarity}
                </div>
                <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">
                    ${prize.name}
                </div>
                <div style="font-size: 1rem; opacity: 0.9;">
                    ${prize.description}
                </div>
                <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                    ${translation.gachaInstruction}
                </div>
            </div>
        `;

        // アニメーション追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // 初期化ローディング表示
    function showInitializationLoading() {
        // ローディングオーバーレイを作成
        const overlay = document.createElement('div');
        overlay.id = 'initialization-loading';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(102, 126, 234, 0.9);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 16px;">⏳</div>
                    <div style="font-size: 1.2rem; font-weight: 600;">データを読み込み中...</div>
                    <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 8px;">スプレッドシートから設定を取得しています</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // 初期化ローディング非表示
    function hideInitializationLoading() {
        const overlay = document.getElementById('initialization-loading');
        if (overlay) {
            overlay.remove();
        }
    }

    // デバッグメッセージ表示
    function showDebugMessage(message, type = 'info') {
        if (!DEBUG_MODE) return;

        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            padding: 12px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        debugDiv.textContent = message;

        document.body.appendChild(debugDiv);

        // 5秒後に自動削除
        setTimeout(() => {
            if (debugDiv.parentNode) {
                debugDiv.parentNode.removeChild(debugDiv);
            }
        }, 5000);
    }

    // 接続テスト機能
    async function testConnection() {
        if (!DEBUG_MODE) return;

        console.log('🔧 Starting connection test...');
        showDebugMessage('🔧 接続テスト開始', 'info');

        try {
            // 1. 基本的なGETリクエストテスト
            const response = await fetch(GAS_WEB_APP_URL);
            console.log('📡 Basic GET test:', response.status, response.statusText);

            if (response.ok) {
                const text = await response.text();
                console.log('📥 GET Response:', text);

                try {
                    const json = JSON.parse(text);
                    console.log('✅ GET JSON parsed:', json);
                    showDebugMessage('✅ 基本接続 成功', 'success');
                } catch {
                    console.log('📄 GET Response is not JSON');
                    showDebugMessage('⚠️ レスポンスがJSONではありません', 'error');
                }
            } else {
                showDebugMessage('❌ 基本接続 失敗: ' + response.status, 'error');
            }

            // 2. 翻訳データ取得テスト
            console.log('🌐 Testing translations...');
            const translations = await getTranslations();
            console.log('✅ Translations test passed:', Object.keys(translations));
            showDebugMessage('✅ 翻訳データ取得 成功', 'success');

            // 3. ガチャ設定取得テスト
            console.log('🎲 Testing gacha config...');
            const gachaConfig = await getGachaConfig();
            console.log('✅ Gacha config test passed:', gachaConfig.length, 'prizes');
            showDebugMessage('✅ ガチャ設定取得 成功', 'success');

        } catch (error) {
            console.error('❌ Connection test failed:', error);
            showDebugMessage('❌ 接続テスト失敗: ' + error.message, 'error');
        }
    }

    // フォーム入力のリアルタイムバリデーション
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });

    // スムーズスクロール効果
    function smoothScrollToResult() {
        gachaResult.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    console.log('京都タワー SANDO バル アンケートアプリ - シンプル版 起動完了');
});