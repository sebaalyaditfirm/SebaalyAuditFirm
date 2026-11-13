(function(){
  var h=document.querySelector('.site-header');
  function onScroll(){h.classList.toggle('scrolled',window.scrollY>20)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var t=document.querySelector('.toggle'),m=document.querySelector('.menu');
  if(t){t.addEventListener('click',function(){t.classList.toggle('open');m.classList.toggle('open');t.setAttribute('aria-expanded',m.classList.contains('open'))});
    m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){t.classList.remove('open');m.classList.remove('open')})})}

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});

  // working paper: tick each row, then stamp
  var rows=document.querySelectorAll('.hero .row'),stamp=document.querySelector('.hero .stamp');
  rows.forEach(function(r,i){setTimeout(function(){r.classList.add('on')},900+i*420)});
  if(stamp)setTimeout(function(){stamp.classList.add('on')},900+rows.length*420+250);

  // only one service open at a time
  var ds=document.querySelectorAll('.svc details');
  ds.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)ds.forEach(function(o){if(o!==d)o.open=false})})});

  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
})();
