/* Aule Engineering public marketing page — GA4 basic consent mode, opt-in only. */
(() => {
  "use strict";
  const ID="G-Y0FHXT02K8", KEY="aule-analytics-consent-v1";
  const live=["auleengineering.com","www.auleengineering.com"].includes(location.hostname);
  let allowed=false,loaded=false;
  function pref(){try{const p=localStorage.getItem(KEY);return p==="yes"||p==="no"?p:null;}catch(_){return null;}}
  function remember(x){try{localStorage.setItem(KEY,x);}catch(_){}}
  function gtag(){window.dataLayer.push(arguments);}
  function activate(){
    if(!live||allowed)return;
    allowed=true;window.auleAnalyticsAllowed=true;
    if(loaded){gtag("consent","update",{analytics_storage:"granted"});return;}
    window.dataLayer=window.dataLayer||[];window.gtag=gtag;loaded=true;
    gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",
      ad_user_data:"denied",ad_personalization:"denied"});
    gtag("js",new Date());
    gtag("consent","update",{analytics_storage:"granted"});
    gtag("config",ID,{send_page_view:false,allow_google_signals:false,
      allow_ad_personalization_signals:false,page_referrer:"",
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
    const box=document.getElementById("aule-consent");if(box)box.hidden=true;
  }
  function setup(){
    if(!live)return;
    const css=document.createElement("link");css.rel="stylesheet";css.href="privacy-analytics.css";document.head.appendChild(css);
    const div=document.createElement("aside");div.id="aule-consent";
    div.setAttribute("role","region");div.setAttribute("aria-label","Website analytics choice");
    const p=document.createElement("p");
    p.append("Optional Google Analytics: allow Aule Engineering to understand general website visits and service interest. No Analytics tag loads before consent. See the ");
    const a=document.createElement("a");a.href="privacy.html";a.textContent="Privacy Notice";p.append(a,".");
    div.appendChild(p);
    [["Allow analytics","yes"],["Reject analytics","no"]].forEach(([text,value])=>{
      const b=document.createElement("button");b.type="button";b.textContent=text;
      if(value==="no")b.className="reject";b.addEventListener("click",()=>decide(value));div.appendChild(b);
    });
    div.hidden=pref()!==null;document.body.appendChild(div);
    const footer=document.querySelector("footer");
    if(footer){
      const b=document.createElement("button");b.type="button";b.className="aule-consent-preferences";
      b.textContent="Analytics preferences";b.addEventListener("click",()=>{div.hidden=false;});footer.appendChild(b);
    }
  }
  window.auleAnalyticsAllowed=false;
  if(live&&pref()==="yes")activate();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});
  else setup();
})();
