(function(){
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  const cfg=window.RK_CONFIG||{};
  if(cfg.GTM_ID){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',cfg.GTM_ID);}
  else if(cfg.GA4_ID){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+cfg.GA4_ID;document.head.appendChild(s);gtag('js',new Date());gtag('config',cfg.GA4_ID);}
  const params=new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'].forEach(k=>{const v=params.get(k);if(v){try{sessionStorage.setItem('rk_'+k,v)}catch(e){}}});
  window.rkTrack=function(eventName,params){window.dataLayer.push(Object.assign({event:eventName},params||{}));if(typeof window.gtag==='function'&&cfg.GA4_ID)gtag('event',eventName,params||{});};
})();
