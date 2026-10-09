import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family:'Nunito',url:staticFile('fonts/nunito-sans-900.ttf'),weight:'900'});
loadFont({family:'Nunito',url:staticFile('fonts/nunito-sans-800.ttf'),weight:'800'});
// Local video-only emphasis face. The exact brand wordmark stays an image asset.
loadFont({family:'Summit Block',url:staticFile('fonts/summit-block.ttf'),weight:'900'});

export const ink='#08243b';
export const mint='#8cf0c5';
export const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};

export function World({src,dark=false}: {src:string;dark?:boolean}){
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <AbsoluteFill>
  <CanvasImage src={staticFile(src)} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(f,[0,8*fps],[1.035,1.1],clamp)}}/>
  {dark&&<AbsoluteFill style={{background:'linear-gradient(90deg,rgba(3,22,36,.97) 0%,rgba(3,22,36,.84) 42%,rgba(3,22,36,.1) 100%)'}}/>}
 </AbsoluteFill>;
}
export function Brand({dark=false,small=false}: {dark?:boolean;small?:boolean}){
 const {fps}=useVideoConfig();
 return <div style={{padding:small?10:16,borderRadius:22,background:dark?'transparent':'#f6fbff',width:small?130:230}}>
  <CanvasImage src={staticFile('art/reference-logo.webp')} premountFor={fps} style={{width:'100%',height:small?130:230,objectFit:'contain'}}/>
 </div>;
}
export function Kicker({children,dark=false}: {children:React.ReactNode;dark?:boolean}){
 return <div style={{fontSize:23,letterSpacing:5,fontWeight:900,color:dark?'#0c796c':mint,marginBottom:30}}>{children}</div>;
}
export function Rise({children,at=0,style={}}:{children:React.ReactNode;at?:number;style?:React.CSSProperties}){
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <div style={{opacity:interpolate(f,[at*fps,(at+.45)*fps],[0,1],clamp),translate:`0 ${interpolate(f,[at*fps,(at+.8)*fps],[50,0],ease)}px`,...style}}>{children}</div>;
}
export function Phone({src,children,x,y,width=420,angle=0,aspectRatio=390/844}: {src?:string;children?:React.ReactNode;x:number;y:number;width?:number;angle?:number;aspectRatio?:number}){
 const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:x,top:y,width:width+24,height:width/aspectRatio+24,padding:12,borderRadius:54,background:'linear-gradient(130deg,#6b8391,#182e3d 22%,#081c2e 75%,#84939c)',boxShadow:'0 35px 90px #00142666, inset 0 0 0 2px #c9e6ef70',rotate:`${angle}deg`}}>
  <div style={{position:'relative',width:'100%',height:'100%',borderRadius:43,overflow:'hidden',background:'#f7fbff'}}>
   {src&&<CanvasImage src={staticFile(src)} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'fill'}}/>}
   {children}
  </div>
 </div>;
}
export function Headline({children,size=110,color='#fff',style={}}: {children:React.ReactNode;size?:number;color?:string;style?:React.CSSProperties}){
 return <div style={{fontSize:size,fontWeight:900,lineHeight:1.035,letterSpacing:-4.5,color,...style}}>{children}</div>;
}
