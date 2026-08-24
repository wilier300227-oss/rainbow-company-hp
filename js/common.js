// ============================================================
// RAINBOW common.js（2026-08 リニューアル / vanilla JS）
// 機能: JP/EN切替・スマホメニュー開閉・メールコピー・スクロール進捗の虹線
// ============================================================

(function () {
  'use strict';

  // ---------- スクロール進捗の虹線 ----------
  var progress = document.getElementById('scroll-progress');
  if (progress) {
    var ticking = false;
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    updateProgress();
  }

  // ---------- スマホメニュー開閉 ----------
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- メールコピー ----------
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    var showCopied = function () {
      if (btn.dataset.busy) return;
      btn.dataset.busy = '1';
      var defaultLabel = btn.textContent;
      var isEn = document.documentElement.lang === 'en';
      btn.textContent = isEn ? 'Copied' : 'コピーしました';
      setTimeout(function () {
        btn.textContent = defaultLabel;
        delete btn.dataset.busy;
      }, 1800);
    };
    var fallbackCopy = function (text) {
      var temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showCopied();
    };
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email');
      if (!email) return;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(showCopied).catch(function () {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  });

  // ---------- JP/EN 切替 ----------
  var langButtons = document.querySelectorAll('.lang-btn');
  if (langButtons.length) {
    var switchLang = function (lang) {
      document.querySelectorAll('.lang').forEach(function (el) {
        var text = lang === 'en' ? el.dataset.en : el.dataset.ja;
        if (text) {
          el.innerHTML = text;
        }
      });
      langButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
      document.documentElement.lang = lang === 'en' ? 'en' : 'ja';
    };
    langButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchLang(btn.getAttribute('data-lang'));
      });
    });
  }
})();
