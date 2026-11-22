// Pay-then-book: collects the email, starts a Ziina payment for the chosen reader, then Ziina returns people to booked.html.
(function(){
  var STATIC = 'https://pay.ziina.com/humanbydesign/qIDSUkCom';
  function go(f){
    var btn = f.querySelector('button'); if (btn) btn.disabled = true;
    var email = f.email.value.trim(), reader = f.getAttribute('data-reader');
    var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams(new FormData(f)).toString()}).catch(function(){});
    fetch('/.netlify/functions/book-checkout', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({reader:reader, email:email, lang:lang})})
      .then(function(r){ return r.json(); })
      .then(function(j){ location.href = j && j.redirect_url ? j.redirect_url : STATIC; })
      .catch(function(){ location.href = STATIC; });
  }
  document.addEventListener('submit', function(e){
    var f = e.target; if (!f.classList || !f.classList.contains('payform')) return;
    e.preventDefault(); go(f);
  });
})();
