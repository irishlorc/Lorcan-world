import * as THREE from 'three';
import {RoomEnvironment} from './node_modules/three/examples/jsm/environments/RoomEnvironment.js';
export {THREE};
export const P=new URLSearchParams(location.search);
export function setup({w=1600,h=1000,bg=null,exposure=1,shadows=true}={}){
  const r=new THREE.WebGLRenderer({antialias:true,alpha:bg===null,preserveDrawingBuffer:true});
  r.setPixelRatio(1);r.setSize(w,h);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=exposure;r.outputColorSpace=THREE.SRGBColorSpace;
  r.shadowMap.enabled=shadows;r.shadowMap.type=THREE.PCFSoftShadowMap;
  document.body.appendChild(r.domElement);
  const scene=new THREE.Scene();if(bg!==null)scene.background=new THREE.Color(bg);
  const pm=new THREE.PMREMGenerator(r);scene.environment=pm.fromScene(new RoomEnvironment(r),0.04).texture;
  return {r,scene};
}
export function done(r,scene,cam){r.render(scene,cam);r.render(scene,cam);window.__img=r.domElement.toDataURL('image/png');document.title='done'}
// a soft noise canvas for fabric / brushed / concrete
export function noiseTex(size=512,{scale=1,streak=0,contrast=.5,base=128}={}){
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');const d=g.createImageData(size,size);
  for(let y=0;y<size;y++){let row=Math.random();for(let x=0;x<size;x++){let v=Math.random();if(streak)v=v*(1-streak)+row*streak;const k=(y*size+x)*4;const val=base+(v-.5)*255*contrast;d.data[k]=d.data[k+1]=d.data[k+2]=val;d.data[k+3]=255}}
  g.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(scale,scale);return t;
}
export function roundRect(w,h,r){const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
