/* Aule Engineering marketing-only GA4: basic page views, disclosed in website privacy notice. No banners. */
(() => {
  "use strict";
  const ID="G-Y0FHXT02K8", KEY="aule-analytics-optout-v2";
  const live=["auleengineering.com","www.auleengineering.com"].includes(location.hostname);
  let allowed=false,loaded=false;
  function pref(){try{const p=localStorage.getItem(KEY);if(p==="yes"||p==="no")return p;return localStorage.getItem("aule-analytics-consent-v1")==="no"?"no":null;}catch(_){return null;}}
  function remember(x){try{localStorage.setItem(KEY,x);}catch(_){}}
  function gtag(){window.dataLayer.push(arguments);}
  function activate(){
    if(!live||allowed||pref()==="no")return;
    allowed=true;window.auleAnalyticsAllowed=true;
    if(loaded){gtag("consent","update",{analytics_storage:"granted"});return;}
    window.dataLayer=window.dataLayer||[];window.gtag=gtag;loaded=true;
    gtag("consent","default",{analytics_storage:"granted",ad_storage:"denied",
      ad_user_data:"denied",ad_personalization:"denied"});
    gtag("js",new Date());
    gtag("config",ID,{send_page_view:false,allow_google_signals:false,
      allow_ad_personalization_signals:false,cookie_expires:2592000,page_referrer:"",
      page_location:location.origin+location.pathname});
    const script=document.createElement("script");
    script.async=true;script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ID);
    document.head.appendChild(script);
    gtag("event","page_view",{page_title:"Aule Engineering",page_location:location.origin+location.pathname,page_referrer:""});
  }
  function clearGaCookies(){
    document.cookie.split(";").forEach(part=>{
      const name=part.trim().split("=")[0];
      if(name!=="_ga"&&!/^_ga_[A-Za-z0-9_]+$/.test(name))return;
      [null,location.hostname,"."+location.hostname,".auleengineering.com"].forEach(domain=>{
        document.cookie=name+"=; Max-Age=0; path=/; SameSite=Lax"+(domain?"; domain="+domain:"");
      });
    });
  }
  function refuse(){
    allowed=false;window.auleAnalyticsAllowed=false;
    if(loaded){gtag("consent","update",{analytics_storage:"denied"});window["ga-disable-"+ID]=true;}
    clearGaCookies();if(loaded)location.reload();
  }
  function decide(x){
    remember(x);if(x==="yes")activate();else refuse();
    const indicator=document.getElementById("aule-analytics-status");
    if(indicator)indicator.textContent=x==="yes"?"Analytics: allowed":"Analytics: off (no Google Analytics tag loaded)";
  }
  function setup(){
    // No banner or popup. Opt-in choices are available only on the privacy page.
    const accept=document.getElementById("aule-analytics-accept");
    const reject=document.getElementById("aule-analytics-reject");
    const status=document.getElementById("aule-analytics-status");
    if(status)status.textContent=pref()==="no"?"Analytics: off":
      "Basic website traffic measurement: on";
    if(accept)accept.addEventListener("click",()=>decide("yes"));
    if(reject)reject.addEventListener("click",()=>decide("no"));
  }
  window.auleAnalyticsAllowed=false;
  if(live&&pref()!=="no")activate();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});
  else setup();
})();
