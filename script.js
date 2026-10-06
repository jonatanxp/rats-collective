document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const field=document.querySelector('.playground');
if(field){
 const rat=field.querySelector('.runner'),button=field.querySelector('button'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=motion.matches,x=field.clientWidth*.7,y=40,vx=25,vy=10,pointer=null,last=0,frame;
 function paint(){rat.style.transform=`translate(${x}px,${y}px) rotate(${Math.sin(x/60)*9}deg)`;}
 function bounds(){x=Math.max(5,Math.min(field.clientWidth-71,x));y=Math.max(5,Math.min(field.clientHeight-112,y));paint();}
 function state(){button.textContent=paused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));}
 function tick(now){const dt=Math.min((now-last)/1000||0,.035);last=now;if(!paused&&!document.hidden){if(pointer){let dx=x+33-pointer.x,dy=y+41-pointer.y,d=Math.hypot(dx,dy);if(d<160){if(d<1){dx=1;dy=1;d=1.4;}vx=dx/d*260;vy=dy/d*180;}}x+=vx*dt;y+=vy*dt;vx*=Math.pow(.99,dt*60);vy*=Math.pow(.99,dt*60);if(Math.abs(vx)<24)vx=vx<0?-24:24;if(x<=5||x>=field.clientWidth-71)vx*=-1;if(y<=5||y>=field.clientHeight-112)vy*=-1;bounds();}frame=requestAnimationFrame(tick);}
 field.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=field.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};}});field.addEventListener('pointerleave',()=>pointer=null);
 button.addEventListener('click',()=>{paused=!paused;state();});motion.addEventListener('change',e=>{paused=e.matches;state();});window.addEventListener('resize',bounds);bounds();state();frame=requestAnimationFrame(tick);
}
