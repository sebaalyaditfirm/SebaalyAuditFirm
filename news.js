(function(){
  var root=document.getElementById('news-root');if(!root)return;
  var base=document.body.dataset.root||'';
  var lang=document.documentElement.lang==='ar'?'ar':'en';
  var T=window.NEWS_I18N||{};
  var mode=root.dataset.mode;
  var ARROW='<svg class="arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function pick(o){if(!o)return'';if(typeof o==='string')return o;return o[lang]||o[lang==='ar'?'en':'ar']||''}
  function fmt(d){try{return new Date(d+'T12:00:00').toLocaleDateString(lang==='ar'?'ar-LB':'en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return d}}
  function inline(s){return s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')}
  function md(src){
    var out=[],blocks=esc(src||'').replace(/\r/g,'').split(/\n{2,}/);
    blocks.forEach(function(b){b=b.trim();if(!b)return;
      if(/^##\s/.test(b))out.push('<h2>'+inline(b.replace(/^##\s*/,''))+'</h2>');
      else if(/^-\s/.test(b))out.push('<ul>'+b.split('\n').map(function(l){return'<li>'+inline(l.replace(/^-\s*/,''))+'</li>'}).join('')+'</ul>');
      else out.push('<p>'+inline(b).replace(/\n/g,'<br>')+'</p>');});
    return out.join('');
  }
  function img(n,cls){
    if(n.image)return'<div class="'+cls+'"><img src="'+base+esc(n.image)+'" alt="" loading="lazy"></div>';
    return'<div class="'+cls+' ph"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></div>';
  }
  function link(n){return 'news.html?id='+encodeURIComponent(n.id)}
  function card(n){
    var cat=pick(n.category);
    return '<a class="ncard" href="'+(mode==='home'?'':'')+link(n)+'">'+img(n,'nimg')+
      '<div class="nmeta"><time datetime="'+esc(n.date)+'">'+esc(fmt(n.date))+'</time>'+(cat?'<span>'+esc(cat)+'</span>':'')+'</div>'+
      '<h3>'+esc(pick(n.title))+'</h3><p>'+esc(pick(n.summary))+'</p><span class="nread">'+esc(T.n_read)+' '+ARROW+'</span></a>';
  }
  function article(n){
    var cat=pick(n.category);
    document.title=pick(n.title)+' | '+document.title.split('|').pop().trim();
    var hero=document.querySelector('.news-hero');if(hero)hero.style.display='none';
    return '<article class="narticle"><a class="nback" href="news.html">'+ARROW+' '+esc(T.n_back)+'</a>'+
      '<div class="nmeta"><time datetime="'+esc(n.date)+'">'+esc(fmt(n.date))+'</time>'+(cat?'<span>'+esc(cat)+'</span>':'')+'</div>'+
      '<h1>'+esc(pick(n.title))+'</h1>'+(pick(n.summary)?'<p class="nlead">'+esc(pick(n.summary))+'</p>':'')+
      (n.image?img(n,'nhero'):'')+'<div class="nbody">'+md(pick(n.body))+'</div></article>';
  }

  fetch(base+'data/news.json?v='+Date.now()).then(function(r){return r.ok?r.json():[]}).catch(function(){return[]}).then(function(list){
    list=(Array.isArray(list)?list:[]).filter(function(n){return n&&n.id&&!n.draft}).sort(function(a,b){return(b.date||'').localeCompare(a.date||'')});
    if(mode==='home'){
      if(!list.length)return;
      document.getElementById('news').hidden=false;
      root.className='ngrid';root.innerHTML=list.slice(0,3).map(card).join('');
      return;
    }
    var id=new URLSearchParams(location.search).get('id');
    if(id){
      var n=list.filter(function(x){return x.id===id})[0];
      root.innerHTML=n?article(n):'<p class="nempty">'+esc(T.n_notfound)+' <a href="news.html">'+esc(T.n_back)+'</a></p>';
      var l=document.querySelector('.lang');if(l)l.href=l.getAttribute('href')+location.search;
      window.scrollTo(0,0);
    }else{
      root.className=list.length?'ngrid':'';
      root.innerHTML=list.length?list.map(card).join(''):'<p class="nempty">'+esc(T.n_empty)+'</p>';
    }
  });
})();
