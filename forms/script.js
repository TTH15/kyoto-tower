// 京都タワー SANDO バル アンケートアプリ - シンプル版

document.addEventListener('DOMContentLoaded', function () {

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
            alert('すべての項目を入力してください。');
            return;
        }

        console.log('アンケート回答:', responses);

        // ガチャ実行
        executeGacha();
    });

    // ガチャ機能
    function executeGacha() {
        // ローディング表示
        gachaResult.style.display = 'block';
        gachaResult.innerHTML = `
            <div style="margin: 20px 0;">
                <div style="font-size: 2rem; margin-bottom: 16px;">🎲</div>
                <div>ガチャを回しています...</div>
            </div>
        `;

        // ガチャ結果（ランダム）
        const prizes = [
            {
                name: "京都タワー展望券",
                image: "🏯",
                rarity: "レア",
                description: "京都タワーの展望台無料券をゲット！"
            },
            {
                name: "SANDO バル 500円クーポン",
                image: "🍜",
                rarity: "ノーマル",
                description: "地下フードコートで使える500円分のクーポン！"
            },
            {
                name: "京都タワーオリジナルグッズ",
                image: "🎁",
                rarity: "レア",
                description: "限定オリジナルグッズをプレゼント！"
            },
            {
                name: "SANDO バル ドリンク無料券",
                image: "🥤",
                rarity: "ノーマル",
                description: "お好きなドリンク1杯無料！"
            },
            {
                name: "京都タワー フォトスポット特典",
                image: "📸",
                rarity: "ノーマル",
                description: "インスタ映えスポットでの撮影特典！"
            }
        ];

        // ガチャ演出（2秒後に結果表示）
        setTimeout(() => {
            const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
            showGachaResult(randomPrize);
        }, 2000);
    }

    // ガチャ結果表示
    function showGachaResult(prize) {
        const rarityColor = prize.rarity === 'レア' ? '#FFD700' : '#87CEEB';

        gachaResult.innerHTML = `
            <div style="animation: bounceIn 0.6s ease-out;">
                <div style="font-size: 4rem; margin-bottom: 16px;">${prize.image}</div>
                <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 8px;">
                    おめでとうございます！
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
                    ※この画面をスタッフにお見せください
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