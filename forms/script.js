document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("survey-form");
    const submitButton = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById("gacha-result");
    const gachaImage = document.getElementById("gacha-image");

    // カスタムセレクトボックスの初期化
    initCustomSelects();

    // フォーム送信処理
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 回答データを収集
        const formData = new FormData(form);
        const data = {
            origin: formData.get('origin'),
            how_know: formData.get('how_know'),
            research_before: formData.get('research_before'),
            research_after: formData.get('research_after')
        };

        // バリデーション
        if (!validateForm(data)) {
            showError("すべての項目を入力してください。");
            return;
        }

        // スプレッドシート連携なしのモック処理
        console.log("アンケート回答:", data);

        // ローディング状態を表示
        showLoading();

        // ガチャ演出開始
        setTimeout(() => {
            performGacha();
        }, 2000);
    });

    // バリデーション関数
    function validateForm(data) {
        return Object.values(data).every(value => value && value.trim() !== '');
    }

    // エラー表示
    function showError(message) {
        resultDiv.innerHTML = `
            <div style="color: #dc3545; background: rgba(220, 53, 69, 0.1); padding: 20px; border-radius: 12px; margin-top: 20px;">
                ⚠️ ${message}
            </div>
        `;
        resultDiv.style.display = "block";
    }

    // ローディング表示
    function showLoading() {
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span style="display: inline-block; width: 20px; height: 20px; border: 2px solid #ffffff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 10px;"></span>
            ガチャ準備中...
        `;

        // スピンアニメーションのCSSを動的に追加
        if (!document.querySelector('#spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        resultDiv.innerHTML = `
            <div style="font-size: 1.5rem; color: var(--primary-color);">
                🎰 ガチャを回しています...
            </div>
        `;
        resultDiv.style.display = "block";
    }

    // ガチャ抽選実行
    function performGacha() {
        const result = lottery();
        const resultEmoji = getResultEmoji(result);
        const resultColor = getResultColor(result);

        // 結果表示
        resultDiv.innerHTML = `
            <div style="color: ${resultColor}; font-size: 2.5rem; margin-bottom: 20px;">
                ${resultEmoji}
            </div>
            <div style="font-size: 2rem; font-weight: 700; color: ${resultColor};">
                ガチャ結果: ${result}
            </div>
            <div style="margin-top: 15px; font-size: 1rem; color: var(--text-color);">
                ${getResultMessage(result)}
            </div>
        `;
        resultDiv.style.display = "block";

        // 画像表示（プレースホルダー）
        gachaImage.style.display = "block";
        gachaImage.src = getResultImage(result);
        gachaImage.alt = `ガチャ結果: ${result}`;

        // フォームを非表示
        form.style.display = "none";

        // 紙吹雪エフェクト（大当たりの場合）
        if (result === "大当たり") {
            createConfetti();
        }
    }

    // ガチャ抽選ロジック
    function lottery() {
        const random = Math.random() * 100;
        if (random < 5) return "大当たり";      // 5%
        else if (random < 20) return "当たり";  // 15%
        else return "はずれ";                   // 80%
    }

    // 結果に応じた絵文字
    function getResultEmoji(result) {
        switch (result) {
            case "大当たり": return "🎉🏆🎊";
            case "当たり": return "🎉✨";
            case "はずれ": return "😅💫";
            default: return "🎰";
        }
    }

    // 結果に応じた色
    function getResultColor(result) {
        switch (result) {
            case "大当たり": return "#ff6b35";
            case "当たり": return "#f7931e";
            case "はずれ": return "#6c757d";
            default: return "var(--primary-color)";
        }
    }

    // 結果に応じたメッセージ
    function getResultMessage(result) {
        switch (result) {
            case "大当たり": return "おめでとうございます！🎊 特別賞品をお受け取りください！";
            case "当たり": return "当たりです！🎁 素敵な賞品をどうぞ！";
            case "はずれ": return "残念でした😊 でも参加ありがとうございました！";
            default: return "";
        }
    }

    // 結果に応じた画像（プレースホルダー）
    function getResultImage(result) {
        // 実際の画像ファイルがない場合のプレースホルダー
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // 背景
        const colors = {
            "大当たり": "#ff6b35",
            "当たり": "#f7931e",
            "はずれ": "#6c757d"
        };

        ctx.fillStyle = colors[result] || "#ccc";
        ctx.fillRect(0, 0, 200, 200);

        // テキスト
        ctx.fillStyle = "white";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(result, 100, 100);

        return canvas.toDataURL();
    }

    // 紙吹雪エフェクト
    function createConfetti() {
        const colors = ['#ff6b35', '#f7931e', '#d63384', '#6f42c1'];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    z-index: 1000;
                    pointer-events: none;
                    animation: confetti-fall 3s linear forwards;
                `;

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 100);
        }

        // 紙吹雪アニメーションCSS
        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confetti-fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // カスタムセレクトボックスの初期化
    function initCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(customSelect => {
            const trigger = customSelect.querySelector('.select-trigger');
            const options = customSelect.querySelector('.select-options');
            const selectOptions = customSelect.querySelectorAll('.select-option');
            const hiddenInput = customSelect.querySelector('input[type="hidden"]');
            const selectText = customSelect.querySelector('.select-text');

            // ドロップダウン内のスクロールでクローズを防ぐ
            options.addEventListener('scroll', (e) => {
                e.stopPropagation();
            });

            // ドロップダウン内のタッチでクローズを防ぐ
            options.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            });

            // トリガークリックでドロップダウン開閉（モバイル最適化）
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeAllSelects();
                customSelect.classList.toggle('active');

                // ドロップダウン開放時のクラス制御
                if (customSelect.classList.contains('active')) {
                    document.body.classList.add('dropdown-open');
                    customSelect.closest('.form-group').classList.add('active-dropdown');
                } else {
                    document.body.classList.remove('dropdown-open');
                    customSelect.closest('.form-group').classList.remove('active-dropdown');
                }
            });

            // タッチイベントで即座に反応
            trigger.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                trigger.click();
            });

            // 選択肢クリック処理
            selectOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // 全ての選択済みクラスを削除
                    selectOptions.forEach(opt => opt.classList.remove('selected'));

                    // クリックした選択肢を選択状態に
                    option.classList.add('selected');

                    // 表示テキストと値を更新
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;
                    selectText.textContent = text;
                    hiddenInput.value = value;

                    // ドロップダウンを閉じる
                    customSelect.classList.remove('active');
                    customSelect.closest('.form-group').classList.remove('active-dropdown');
                    document.body.classList.remove('dropdown-open');
                });

                // タッチエンドで即座に反応（モバイル最適化）
                option.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    option.click();
                });

                // 軽量化：ホバーエフェクトはCSSに委譲
            });
        });

        // ドキュメントクリックで全てのセレクトを閉じる
        document.addEventListener('click', (e) => {
            // カスタムセレクト内のクリックでない場合は閉じる
            if (!e.target.closest('.custom-select')) {
                closeAllSelects();
            }
        });

        // タッチイベントでも閉じる
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.custom-select')) {
                closeAllSelects();
            }
        });

        // ページスクロール時にドロップダウンを閉じる（ドロップダウン内スクロールは除外）
        document.addEventListener('scroll', (e) => {
            // ドロップダウン内のスクロールでない場合のみ閉じる
            if (!e.target.closest('.select-options')) {
                closeAllSelects();
            }
        }, true);

        // Escapeキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllSelects();
            }
        });
    }

    // 全てのカスタムセレクトを閉じる
    function closeAllSelects() {
        const activeSelects = document.querySelectorAll('.custom-select.active');
        activeSelects.forEach(select => {
            select.classList.remove('active');
            select.closest('.form-group').classList.remove('active-dropdown');
        });
        document.body.classList.remove('dropdown-open');
    }
});