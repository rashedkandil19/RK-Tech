document.addEventListener('DOMContentLoaded',()=>{
 const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 /* Single blocks fade up; grids/lists animate their children one after another */
 document.querySelectorAll('.section-heading, .contact-layout, .cta-band .container, .form-note, .section-lead').forEach(el=>el.classList.add('reveal'));
 document.querySelectorAll('.feature-row, .pricing-grid, .extras-grid, .process-grid, .project-grid, .faq').forEach(group=>{
   group.classList.add('reveal-stagger');
   Array.from(group.children).forEach((child,i)=>child.style.setProperty('--i',i));
 });
 const revealItems=document.querySelectorAll('.reveal, .reveal-stagger');
 if('IntersectionObserver' in window&&!reduceMotion){
   const revealObserver=new IntersectionObserver((entries,observer)=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         entry.target.classList.add('is-visible');
         observer.unobserve(entry.target);
       }
     });
   },{threshold:0.12,rootMargin:'0px 0px -35px 0px'});
   revealItems.forEach(item=>revealObserver.observe(item));
 }else{
   revealItems.forEach(item=>item.classList.add('is-visible'));
 }

 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.mobile-nav');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));}
 document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>a.addEventListener('click',()=>window.rkTrack&&rkTrack('whatsapp_click',{link_url:a.href})));
 document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>window.rkTrack&&rkTrack('phone_click')));
 const form=document.getElementById('leadForm');if(form){const requested=new URLSearchParams(location.search).get('service');const optionIndex={starter:1,business:2,app:3}[requested];if(optionIndex&&form.elements.service)form.elements.service.selectedIndex=optionIndex;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form),lang=window.RK_LANG||'en';const labels=lang==='ar'?{name:'الاسم',business:'النشاط',phone:'رقم الهاتف',service:'الخدمة',budget:'الميزانية',message:'تفاصيل المشروع'}:{name:'Name',business:'Business',phone:'Phone',service:'Service',budget:'Budget',message:'Project details'};let lines=Object.keys(labels).map(k=>`${labels[k]}: ${fd.get(k)||'-'}`);['utm_source','utm_medium','utm_campaign','gclid'].forEach(k=>{try{const v=sessionStorage.getItem('rk_'+k);if(v)lines.push(k+': '+v)}catch(e){}});const msg=lines.join('\n');window.rkTrack&&rkTrack('lead_form_submit',{form_name:'project_enquiry',service:fd.get('service')||'unspecified'});window.rkTrack&&rkTrack('whatsapp_click',{source:'project_enquiry_form'});const url='https://wa.me/201044310426?text='+encodeURIComponent(msg);window.open(url,'_blank','noopener');const target=lang==='ar'?'../ar/thank-you.html':'../en/thank-you.html';setTimeout(()=>location.href=target,250);});}
});

/* ===== Motion layer: scroll progress, sticky header state, card spotlight, price count-up ===== */
document.addEventListener('DOMContentLoaded',()=>{
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const header=document.querySelector('.site-header');
 const bar=document.createElement('div');bar.className='scroll-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
 let ticking=false;
 const onScroll=()=>{
   if(ticking)return;ticking=true;
   requestAnimationFrame(()=>{
     const max=document.documentElement.scrollHeight-window.innerHeight;
     bar.style.setProperty('--p',max>0?Math.min(1,window.scrollY/max).toFixed(4):0);
     if(header)header.classList.toggle('is-scrolled',window.scrollY>12);
     ticking=false;
   });
 };
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();

 if(!reduce&&window.matchMedia('(hover:hover)').matches){
   document.querySelectorAll('.price-card, .feature-row>div, .extra-card, .process-grid article, .contact-card, .project-card').forEach(card=>{
     card.addEventListener('pointermove',e=>{
       const r=card.getBoundingClientRect();
       card.style.setProperty('--mx',(e.clientX-r.left)+'px');
       card.style.setProperty('--my',(e.clientY-r.top)+'px');
     });
   });
 }

 /* Count the price up once, then restore the exact original text node */
 if(!reduce&&'IntersectionObserver' in window){
   const nodes=[];
   document.querySelectorAll('.price strong').forEach(el=>{
     const t=Array.from(el.childNodes).find(n=>n.nodeType===3&&/\d/.test(n.textContent));
     if(!t)return;
     const original=t.textContent;
     const m=original.match(/^(\s*)([\d,]+)(.*)$/s);
     if(!m)return;
     nodes.push({t,original,lead:m[1],target:parseInt(m[2].replace(/,/g,''),10),tail:m[3]});
   });
   const io=new IntersectionObserver((entries,obs)=>{
     entries.forEach(en=>{
       if(!en.isIntersecting)return;
       obs.unobserve(en.target);
       const item=nodes.find(n=>n.t.parentNode===en.target);
       if(!item)return;
       const start=performance.now(),dur=1200;
       const step=now=>{
         const k=Math.min(1,(now-start)/dur),eased=1-Math.pow(1-k,3);
         item.t.textContent=item.lead+Math.round(item.target*eased).toLocaleString('en-US')+item.tail;
         if(k<1)requestAnimationFrame(step);else item.t.textContent=item.original;
       };
       requestAnimationFrame(step);
     });
   },{threshold:.6});
   nodes.forEach(n=>io.observe(n.t.parentNode));
 }
});
