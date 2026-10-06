const field = document.querySelector('.rats');
if (field) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Jitter one rat inside each grid cell to vary the arrangement without clusters.
  const starts = Array.from({length:9}, (_,i) => [
    ((i % 3) + .12 + Math.random() * .76) / 3,
    (Math.floor(i / 3) + .12 + Math.random() * .76) / 3
  ]);
  const rats = starts.map(([px,py],i) => {
    const el=document.createElement('img');
    el.src='assets/rat-original.png'; el.alt=''; el.className='rat'; el.draggable=false;
    field.appendChild(el);
    return {el,px,py,x:0,y:0,vx:0,vy:0,angle:Math.random()*360};
  });
  let width=0,height=0,size=48,frame=0,last=0,pointer=null;
  function paint(r){r.el.style.transform='translate('+r.x+'px,'+r.y+'px) rotate('+r.angle+'deg)';}
  function layout(){
    width=field.clientWidth; height=field.clientHeight;size=rats[0].el.clientWidth;
    rats.forEach(r=>{r.x=r.px*Math.max(0,width-size);r.y=r.py*Math.max(0,height-size);r.vx=r.vy=0;paint(r);});
  }
  function tick(now){
    frame=0;
    if(reduced.matches||document.hidden)return;
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
    const rect=field.getBoundingClientRect();pointer={x:e.clientX-rect.left,y:e.clientY-rect.top};
    let moved=false;
    for(const r of rats){let dx=r.x+size/2-pointer.x,dy=r.y+size/2-pointer.y;let d=Math.hypot(dx,dy);
      if(d<155){if(d<1){dx=1;dy=-1;d=Math.SQRT2;}const speed=220+(155-d)*2;r.vx=dx/d*speed;r.vy=dy/d*speed;moved=true;}
    }
    if(moved&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  window.addEventListener('pointermove',scatter,{passive:true});
  window.addEventListener('pointerdown',scatter,{passive:true});
  window.addEventListener('resize',layout);
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;layout();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}});
  layout();
}
