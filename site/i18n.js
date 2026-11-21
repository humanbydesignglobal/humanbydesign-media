// Human by Design: English / Arabic switch, shared by every page.
// Text marked data-i18n="key" is swapped for window.HBD_I18N[key] in Arabic.
// data-i18n-attr="placeholder:key;aria-label:key" swaps attributes the same way.
(function () {
  var KEY = 'hbd-lang';
  function initial() {
    try {
      var u = new URLSearchParams(location.search).get('lang');
      if (u === 'ar' || u === 'en') { try { localStorage.setItem(KEY, u); } catch (e) {} return u; }
    } catch (e) {}
    try { var s = localStorage.getItem(KEY); if (s === 'ar' || s === 'en') return s; } catch (e) {}
    return /^ar/i.test(navigator.language || '') ? 'ar' : 'en';
  }
  var cur = initial();
  var store = typeof WeakMap === 'function' ? new WeakMap() : null;
  window.HBDL = function () { return cur; };

  function setDoc(l) {
    var h = document.documentElement;
    h.setAttribute('lang', l);
    h.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  }
  setDoc(cur);

  function orig(el, name, read) {
    var o = store ? store.get(el) : el.__hbd;
    if (!o) { o = {}; if (store) store.set(el, o); else el.__hbd = o; }
    if (!(name in o)) o[name] = read();
    return o[name];
  }

  function apply() {
    var D = window.HBD_I18N || {}, ar = cur === 'ar';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var en = orig(el, '$html', function () { return el.innerHTML; });
      el.innerHTML = ar && D[k] != null ? D[k] : en;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), a = p[0], k = p[1];
        if (!a || !k) return;
        var en = orig(el, a, function () { return el.getAttribute(a) || ''; });
        el.setAttribute(a, ar && D[k] != null ? D[k] : en);
      });
    });
    var t = orig(document, 'title', function () { return document.title; });
    document.title = ar && D['meta.title'] ? D['meta.title'] : t;
    var md = document.querySelector('meta[name="description"]');
    if (md) {
      var mden = orig(md, 'content', function () { return md.getAttribute('content'); });
      md.setAttribute('content', ar && D['meta.desc'] ? D['meta.desc'] : mden);
    }
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.textContent = ar ? 'English' : 'عربي';
      b.setAttribute('lang', ar ? 'en' : 'ar');
      b.setAttribute('dir', ar ? 'ltr' : 'rtl');
      b.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
    });
    if (typeof window.HBD_onLang === 'function') window.HBD_onLang(cur);
  }

  window.HBDsetLang = function (l) {
    cur = l === 'ar' ? 'ar' : 'en';
    try { localStorage.setItem(KEY, cur); } catch (e) {}
    setDoc(cur);
    apply();
    try {
      var u = new URL(location.href);
      if (cur === 'ar') u.searchParams.set('lang', 'ar'); else u.searchParams.delete('lang');
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  };

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-lang-toggle]') : null;
    if (b) { e.preventDefault(); window.HBDsetLang(cur === 'ar' ? 'en' : 'ar'); }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
