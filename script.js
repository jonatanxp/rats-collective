
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const field = document.querySelector('.rats');
if (field) {
  const title=document.querySelector('.identity h1');
  const rats=[];
  let width=0,height=0,size=48,frame=0,last=0;
  function paint(r){r.el.style.transform='translate('+r.x+'px,'+r.y+'px) rotate('+r.angle+'deg)';}
  function clearOfTitle(x,y){
    const a=title.getBoundingClientRect(),b=field.getBoundingClientRect();
    // Include rotated corners and the pop animation's largest size.
    const pad=size*.45+16;
    return x+size+pad<a.left-b.left||x-pad>a.right-b.left||y+size+pad<a.top-b.top||y-pad>a.bottom-b.top;
  }
  function position(preferred){
    const maxX=Math.max(0,width-size),maxY=Math.max(0,height-size);
    for(let attempt=0;attempt<180;attempt++){
      const x=attempt===0&&preferred?preferred[0]*maxX:Math.random()*maxX;
      const y=attempt===0&&preferred?preferred[1]*maxY:Math.random()*maxY;
      if(clearOfTitle(x,y)&&(attempt>60||rats.every(r=>Math.hypot(r.x-x,r.y-y)>size*1.25)))return{x,y};
    }
    // Extremely short windows may have little room; only use a clear spot.
    for(let y=0;y<=maxY;y+=12)for(let x=0;x<=maxX;x+=12)if(clearOfTitle(x,y))return{x,y};
    return null;
  }
  function addRat(preferred,animate=false){
    const p=position(preferred);if(!p)return;
    const el=document.createElement('span'),img=document.createElement('img');
    el.className='rat'+(animate?' new-rat':'');img.src='assets/rat-original.png';img.alt='';img.draggable=false;
    el.appendChild(img);field.appendChild(el);
    const r={el,x:p.x,y:p.y,vx:0,vy:0,angle:Math.random()*360};rats.push(r);paint(r);
  }
  function measure(){width=field.clientWidth;height=field.clientHeight;size=matchMedia('(max-width:600px)').matches?38:48;}
  function layout(){
    measure();rats.forEach(r=>{r.x=Math.max(0,Math.min(width-size,r.x));r.y=Math.max(0,Math.min(height-size,r.y));
      if(!clearOfTitle(r.x,r.y)){const p=position();if(p){r.x=p.x;r.y=p.y;}}paint(r);
    });
  }
  function tick(now){
    frame=0;if(reduced.matches||document.hidden)return;
    const dt=Math.min((now-last)/1000||.016,.035);last=now;let moving=false;
    for(const r of rats){
      r.x+=r.vx*dt;r.y+=r.vy*dt;
      if(r.x<0){r.x=0;r.vx=Math.abs(r.vx);}if(r.x>width-size){r.x=Math.max(0,width-size);r.vx=-Math.abs(r.vx);}
      if(r.y<0){r.y=0;r.vy=Math.abs(r.vy);}if(r.y>height-size){r.y=Math.max(0,height-size);r.vy=-Math.abs(r.vy);}
      const drag=Math.exp(-3.4*dt);r.vx*=drag;r.vy*=drag;
      if(Math.hypot(r.vx,r.vy)>2){r.angle=Math.atan2(r.vy,r.vx)*180/Math.PI-90;moving=true;}else{r.vx=r.vy=0;}
      paint(r);
    }
    if(moving)frame=requestAnimationFrame(tick);
  }
  function scatter(e){
    if(reduced.matches)return;
    const rect=field.getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top;let moved=false;
    for(const r of rats){let dx=r.x+size/2-px,dy=r.y+size/2-py,d=Math.hypot(dx,dy);
      if(d<155){if(d<1){dx=1;dy=-1;d=Math.SQRT2;}const speed=220+(155-d)*2;r.vx=dx/d*speed;r.vy=dy/d*speed;moved=true;}
    }
    if(moved&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  window.addEventListener('pointermove',scatter,{passive:true});
  window.addEventListener('pointerdown',scatter,{passive:true});
  window.addEventListener('resize',layout);
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;rats.forEach(r=>r.vx=r.vy=0);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}});
  measure();
  for(let i=0;i<9;i++)addRat([((i%3)+.12+Math.random()*.76)/3,(Math.floor(i/3)+.12+Math.random()*.76)/3]);
  // Font metrics can change after first paint; keep initial placements clear.
  document.fonts.ready.then(layout);
  document.querySelector('.spawn-rat').addEventListener('click',()=>addRat(null,true));
}

// A short rat crossing works on all browsers without replacing normal page links.
let navigating=false;
const scriptUrl=document.currentScript.src;
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname||reduced.matches)return;
  event.preventDefault();if(navigating)return;navigating=true;
  const runner=document.createElement('div'),img=document.createElement('img');
  runner.className='navigation-rat';runner.setAttribute('aria-hidden','true');
  img.src=new URL('assets/rat-original.png',scriptUrl).href;img.alt='';runner.appendChild(img);
  document.body.appendChild(runner);document.body.classList.add('leaving');
  setTimeout(()=>location.assign(url.href),590);
});
window.addEventListener('pageshow',()=>{
  navigating=false;document.body.classList.remove('leaving');document.querySelector('.navigation-rat')?.remove();
});
