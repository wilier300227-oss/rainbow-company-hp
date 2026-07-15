// Reveal Animation（loadハンドラとscrollハンドラの両方から呼ぶためグローバルに定義）
function reveal() {
    $('.reveal').each(function () {
        const windowHeight = $(window).height();
        const elementTop = $(this).offset().top;
        const elementVisible = 150;
        if (elementTop < $(window).scrollTop() + windowHeight - elementVisible) {
            $(this).addClass('active');
        }
    });
}

$(window).on('load', function () {
    setTimeout(() => {
        $('#loader').fadeOut(500);
        reveal();
    }, 800);
});

$(document).ready(function () {
    // スクロール検知（ナビゲーション変化 & 要素の表示）
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('nav').addClass('scrolled');
        } else {
            $('nav').removeClass('scrolled');
        }
        reveal();
    });

    // スマホメニューの開閉
    $('#menu-open').click(() => $('#mobile-menu').css('display', 'flex').hide().fadeIn(300));
    $('#menu-close, #mobile-menu a').click(() => $('#mobile-menu').fadeOut(300));

    // メールアドレスのコピー（メールソフト未設定の環境向け）
    $(document).on('click', '.copy-email-btn', function () {
        const email = $(this).data('email');
        const $feedback = $(this).closest('.mail-card').find('.copy-feedback');
        const showFeedback = () => {
            $feedback.removeClass('opacity-0');
            setTimeout(() => $feedback.addClass('opacity-0'), 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(showFeedback);
        } else {
            const temp = document.createElement('textarea');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showFeedback();
        }
    });
});

// 言語切り替え機能

function switchLang(lang) {
    // 1. テキストの切り替え処理
    // "lang" クラスがついている全ての要素を探す
    const elements = document.querySelectorAll('.lang');

    elements.forEach(element => {
        // data-ja または data-en 属性からテキストを取得して書き換える
        if (lang === 'ja') {
            // 日本語モード: data-jaがあればそれを表示
            if (element.dataset.ja) {
                // HTMLタグが含まれる場合（<br>など）に対応するため innerHTML を使用
                element.innerHTML = element.dataset.ja;
            }
        } else if (lang === 'en') {
            // 英語モード: data-enがあればそれを表示
            if (element.dataset.en) {
                element.innerHTML = element.dataset.en;
            }
        }
    });

    // 2. ボタンの見た目（背景白）の切り替え処理
    const buttons = document.querySelectorAll('.lang-btn');

    buttons.forEach(btn => {
        // 一旦すべてのボタンから active を外す
        btn.classList.remove('active');

        // 引数の lang とボタンの文字（JP/EN）が一致するものに active をつける
        // ※トリム()で余計な空白を除去して判定
        const text = btn.innerText.trim();

        if (lang === 'ja' && text === 'JP') {
            btn.classList.add('active');
        } else if (lang === 'en' && text === 'EN') {
            btn.classList.add('active');
        }
    });
}

const scrollDown = document.querySelector('.scroll-down');

    window.addEventListener('scroll', function() {
        // 100px以上スクロールしたらクラスをつけるだけ
        if (window.scrollY > 100) {
            scrollDown.classList.add('is-hidden');
        }
        // 「else { ... }」を削除したので、上にスクロールしても戻りません
    });