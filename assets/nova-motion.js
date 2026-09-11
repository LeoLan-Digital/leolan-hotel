/* Local-only visual interaction. No analytics, guest data or external services. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const controls = [];
  function label(button,running) {
    button.dataset.running=String(running);
    button.textContent=running?button.dataset.pause:button.dataset.play;
  }
  // One throttled loop per visible canvas. No work when hidden, paused or offscreen.
  function stage(canvas,button,render) {
    if (!canvas || !button) return null;
    const ctx=canvas.getContext('2d');
    if(!ctx) {button.hidden=true;return null;}
    const state={ctx,w:0,h:0,time:0,running:!reduced.matches,visible:false,frame:0,last:0};
    const paint=() => {if(state.w&&state.h)render(state);};
    const permitted=()=>state.running&&state.visible&&!document.hidden;
    function loop(now){
      state.frame=0;
      if(!permitted())return;
      if(!state.last)state.last=now;
      if(now-state.last>=32){state.time+=Math.min(now-state.last,64)/1000;state.last=now;paint();}
      state.frame=requestAnimationFrame(loop);
    }
    function sync(){
      label(button,state.running);
      if(permitted()&&!state.frame){state.last=0;state.frame=requestAnimationFrame(loop);}
      if(!permitted()&&state.frame){cancelAnimationFrame(state.frame);state.frame=0;}
    }
    state.setRunning=v=>{state.running=v;sync();paint();};
    state.paint=paint;
    button.addEventListener('click',()=>state.setRunning(!state.running));
    const resize=()=>{
      const box=canvas.getBoundingClientRect();
      state.w=box.width;state.h=box.height;
      const dpr=Math.min(devicePixelRatio||1,1.7);
      canvas.width=Math.round(state.w*dpr);canvas.height=Math.round(state.h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);paint();
    };
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
    else addEventListener('resize',resize,{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
      state.visible=entries.some(e=>e.isIntersecting);sync();
    },{rootMargin:'60px'}).observe(canvas);
    else state.visible=true;
    document.addEventListener('visibilitychange',sync);
    controls.push(state);resize();sync();return state;
  }
  function drag(canvas,move){
    let point=null,dragging=false;
    canvas.addEventListener('pointerdown',e=>{point={x:e.clientX,y:e.clientY,id:e.pointerId};dragging=false;});
    canvas.addEventListener('pointermove',e=>{
      if(!point||point.id!==e.pointerId)return;
      const dx=e.clientX-point.x,dy=e.clientY-point.y;
      // Preserve ordinary one-finger vertical page scrolling on phones.
      if(!dragging&&Math.abs(dy)>Math.abs(dx)+5){point=null;return;}
      if(!dragging&&Math.abs(dx)<5)return;
      dragging=true;
      if(!canvas.hasPointerCapture(e.pointerId))canvas.setPointerCapture(e.pointerId);
      move(dx,dy);point.x=e.clientX;point.y=e.clientY;
    });
    const release=()=>{point=null;dragging=false;};
    canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    canvas.addEventListener('lostpointercapture',release);
  }
  const dot=(ctx,x,y,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();};
  const line=(ctx,a,b,color,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();};
  const glow=(ctx,x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
  // Deterministic particles avoid layout shifts and never imply live measurements.
  let seed=73019;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const stars=Array.from({length:125},()=>({x:random(),y:random(),r:.4+random()*1.2,p:random()*TAU}));
  function starfield(ctx,w,h,t){stars.forEach(s=>dot(ctx,s.x*w,s.y*h,s.r,`rgba(145,179,244,${.13+.2*(.5+.5*Math.sin(t*.6+s.p))})`));}
  const networkCanvas=document.querySelector('.network-canvas');
  const nodeButtons=[...document.querySelectorAll('.network-node')];
  const networkText=document.getElementById('network-copy');
  if(networkCanvas&&networkText){
    const copy=JSON.parse(networkText.textContent);
    const particles=Array.from({length:6},()=>Array.from({length:38},()=>({a:random()*TAU,r:20+random()*62,s:.06+random()*.1,p:random()*TAU})));
    let selected=0,offset=0;
    const network=stage(networkCanvas,document.querySelector('.network-toggle'),s=>{
      const {ctx,w,h,time:t}=s;ctx.clearRect(0,0,w,h);starfield(ctx,w,h,t);
      const narrow=w<600,cx=w*.5,cy=h*.48,centers=[];
      glow(ctx,cx,cy,narrow?120:180,'#426ffc40');
      for(let i=0;i<6;i++){
        const angle=-Math.PI*.72+i*TAU/6+Math.sin(t*.11+i)*.035+offset;
        const mobileX=[.26,.74,.81,.74,.26,.19],mobileY=[.22,.22,.48,.76,.76,.48];
        const x=narrow?w*mobileX[i]+Math.sin(t*.13+i+offset)*4:cx+Math.cos(angle)*w*.31;
        const y=narrow?h*mobileY[i]+Math.cos(t*.12+i+offset)*6:cy+Math.sin(angle)*h*.29;
        centers.push({x,y});
        line(ctx,{x:cx,y:cy},{x,y},i===selected?'#ec9b6260':'#6c92e929');
        const phase=(t*.16+i*.15)%1;
        dot(ctx,cx+(x-cx)*phase,cy+(y-cy)*phase,2,i===selected?'#ffc689':'#9bbaff');
        glow(ctx,x,y,narrow?64:90,i===selected?'#f38c342b':'#4e7cff2a');
        nodeButtons[i].style.left=x+'px';nodeButtons[i].style.top=y+'px';
        const scale=narrow?.64:1;
        const points=particles[i].map(p=>({x:x+Math.cos(p.a+t*p.s+offset)*p.r*scale,y:y+Math.sin(p.a+t*p.s+offset)*p.r*scale}));
        points.forEach((p,j)=>{
          dot(ctx,p.x,p.y,j%8===0?2.3:1.2,j%8===0?'#b4c9ff':'#688ee4');
          if(j%3===0)line(ctx,p,points[(j+5)%points.length],'#638cfb26',.6);
          if(j%9===0)line(ctx,p,{x,y},'#86a5ff38',.7);
        });
      }
      centers.forEach((c,i)=>line(ctx,c,centers[(i+1)%6],'#6781bc14',.7));
      for(let i=0;i<3;i++){
        const r=44+((t*12+i*23)%72);
        ctx.strokeStyle=`rgba(123,165,255,${.15*(1-(r-44)/72)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();
      }
    });
    nodeButtons.forEach((button,i)=>button.addEventListener('click',()=>{
      selected=i;nodeButtons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      const detail=document.getElementById('network-detail');
      detail.querySelector('h3').textContent=copy.names[i];detail.querySelector('p').textContent=copy.descriptions[i];network?.paint();
    }));
    if(network)drag(networkCanvas,dx=>{offset+=dx*.004;network.paint();});
  }
  const globeCanvas=document.querySelector('.globe-canvas');
  if(globeCanvas){
    let land=[],longitude=-.35,latitude=-.20,manual=0;
    const sphere=(lon,lat)=>{lon*=Math.PI/180;lat*=Math.PI/180;return{x:Math.cos(lat)*Math.sin(lon),y:Math.sin(lat),z:Math.cos(lat)*Math.cos(lon)};};
    const cities=[[13.7,51],[28.97,41],[55.27,25.2],[115.2,-8.6],[103.8,1.3],[139.7,35.7],[-74,40.7],[-46.6,-23.5]].map(c=>sphere(...c));
    // Great-circle routes projected above an actual Natural Earth land mask.
    const routes=cities.slice(1).map(end=>{
      const start=cities[0],omega=Math.acos(clamp(start.x*end.x+start.y*end.y+start.z*end.z,-1,1));
      return Array.from({length:65},(_,i)=>{const t=i/64,a=Math.sin((1-t)*omega)/Math.sin(omega),b=Math.sin(t*omega)/Math.sin(omega),r=1+Math.sin(t*Math.PI)*.13;return{x:(a*start.x+b*end.x)*r,y:(a*start.y+b*end.y)*r,z:(a*start.z+b*end.z)*r};});
    });
    const globe=stage(globeCanvas,document.querySelector('.globe-toggle'),s=>{
      const {ctx,w,h,time:t}=s;ctx.clearRect(0,0,w,h);starfield(ctx,w,h,t);
      const cx=w*.5,cy=h*.5,r=Math.min(w*.43,h*.36),yaw=longitude+t*.065+manual;
      const project=p=>{const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=p.z*Math.cos(yaw)-p.x*Math.sin(yaw),y=p.y*Math.cos(latitude)-z*Math.sin(latitude);return{x:cx+x*r,y:cy-y*r,z:p.y*Math.sin(latitude)+z*Math.cos(latitude)};};
      glow(ctx,cx,cy,r*1.2,'#2453b42a');
      const shade=ctx.createRadialGradient(cx-r*.25,cy-r*.3,0,cx,cy,r);
      shade.addColorStop(0,'#12264b');shade.addColorStop(.86,'#09152a');shade.addColorStop(1,'#173568');
      ctx.fillStyle=shade;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
      ctx.strokeStyle='#5a7cbb40';ctx.lineWidth=1;ctx.stroke();
      // Sparse ocean dots make the globe visibly spherical while land is loading.
      for(let lat=-72;lat<=72;lat+=12)for(let lon=-180;lon<180;lon+=12){const p=project(sphere(lon,lat));if(p.z>0)dot(ctx,p.x,p.y,.65,`rgba(85,124,188,${.1+p.z*.2})`);}
      for(const point of land){const p=project(point);if(p.z<=0)continue;dot(ctx,p.x,p.y,Math.max(.7,r/150)*(.5+p.z*.5),`rgba(107,155,245,${.2+p.z*.66})`);}
      routes.forEach((route,index)=>{
        let prev=null;
        route.forEach(v=>{const p=project(v);if(p.z>0&&prev?.z>0)line(ctx,prev,p,'#ee9f4966',1);prev=p;});
        const head=project(route[Math.floor(((t*.14+index*.14)%1)*64)]);
        if(head.z>0){glow(ctx,head.x,head.y,10,'#ffb86b90');dot(ctx,head.x,head.y,2,'#ffe0a5');}
      });
      cities.forEach((city,i)=>{const p=project(city);if(p.z<=0)return;glow(ctx,p.x,p.y,14,i===0?'#77a4ff88':'#ed9b5577');dot(ctx,p.x,p.y,i===0?4:2.8,i===0?'#9dc2ff':'#ffcf87');});
    });
    if(globe){
      const load=()=>fetch('/assets/motion/land-points.json').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();}).then(points=>{
        land=points.map(p=>sphere(p[0],p[1]));document.querySelector('.world-fallback').hidden=true;globe.paint();
      }).catch(()=>{document.querySelector('.world-fallback').hidden=false;});
      if('IntersectionObserver' in window){const loader=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loader.disconnect();load();}},{rootMargin:'300px'});loader.observe(globeCanvas);}else load();
      drag(globeCanvas,(dx,dy)=>{manual+=dx*.006;latitude=clamp(latitude+dy*.003,-.8,.8);globe.paint();});
      document.querySelector('.globe-left').addEventListener('click',()=>{manual-=.35;globe.paint();});
      document.querySelector('.globe-right').addEventListener('click',()=>{manual+=.35;globe.paint();});
    }
  }
  const video=document.querySelector('.hero-video'),videoButton=document.querySelector('.hero-media-control');
  let syncVideo=()=>{};
  if(video&&videoButton){
    let wanted=!reduced.matches&&!navigator.connection?.saveData,visible=true,loading=false;
    video.muted=true;video.defaultMuted=true;
    const load=()=>{if(loading)return;loading=true;const source=video.querySelector('source');source.src=source.dataset.src;video.load();};
    syncVideo=()=>{
      if(wanted&&visible&&!document.hidden){load();video.play().catch(()=>{label(videoButton,false);});}
      else video.pause();
    };
    video.addEventListener('playing',()=>{video.classList.add('is-playing','has-played');label(videoButton,true);});
    video.addEventListener('pause',()=>{video.classList.remove('is-playing');label(videoButton,false);});
    video.addEventListener('error',()=>{video.classList.remove('is-playing','has-played');label(videoButton,false);});
    videoButton.addEventListener('click',()=>{wanted=video.paused;syncVideo();});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);syncVideo();}).observe(video);
    document.addEventListener('visibilitychange',syncVideo);
    controls.push({setRunning:value=>{wanted=value;syncVideo();}});syncVideo();
  }
  reduced.addEventListener('change',()=>{controls.forEach(control=>control.setRunning(!reduced.matches));});
})();
