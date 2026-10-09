import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, OffthreadVideo, Series, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './style';

// V3 keeps source pixels intact. Camera moves select a readable region of the
// owner's recording; they never reconstruct app interactions or earned progress.
const navy='#071b42';
const green='#00765d';
const paper='#f5fafc';
const smooth={...clamp,easing:Easing.bezier(.22,1,.36,1)};
const photo='art/photo-counting-concept.png';
const base:React.CSSProperties={fontFamily:'Nunito',fontWeight:900,color:navy,overflow:'hidden',background:paper};

function Caption({children,dark=false}: {children:React.ReactNode;dark?:boolean}) {
 return <div style={{position:'absolute',bottom:35,left:60,right:60,textAlign:'center',fontSize:43,lineHeight:1.15,color:dark?'white':navy}}><span style={{display:'inline-block',background:dark?'#071b42ed':'#f8fcffed',padding:'16px 30px',borderRadius:18}}>{children}</span></div>;
}
function SceneTop({children,concept=false}: {children:React.ReactNode;concept?:boolean}) {
 return <div style={{position:'absolute',top:40,left:60,right:60,display:'flex',justifyContent:'space-between',alignItems:'start',fontSize:26,letterSpacing:1,color:green}}><span style={{maxWidth:290,lineHeight:1.25}}>{children}</span>{concept&&<span style={{fontSize:24,color:navy,padding:'10px 20px',border:'2px solid #94aaa6',borderRadius:30,background:paper}}>Photo feature concept</span>}</div>;
}
function Picture({src,style}: {src:string;style:React.CSSProperties}) {
 const {fps}=useVideoConfig();
 return <CanvasImage src={staticFile(src)} premountFor={fps} style={style}/>;
}
function Scenery({src='art/landing-highland-wide.webp',veil=false}: {src?:string;veil?:boolean}) {
 return <AbsoluteFill><Picture src={src} style={{width:'100%',height:'100%',objectFit:'cover'}}/>{veil&&<AbsoluteFill style={{background:'#f5fafcee'}}/>}</AbsoluteFill>;
}
// A single exact crop, with a gentle editorial camera move. Width and y are
// expressed in output pixels so count/button close-ups can be checked directly.
function AppCamera({src,width,top,x=960,border=true,rate=1}: {src:string;width:number;top:number;x?:number;border?:boolean;rate?:number}) {
 return <div style={{position:'absolute',left:x-width/2,top,width,height:width*1862/960,borderRadius:border?28:0,overflow:'hidden',boxShadow:border?'0 18px 65px #061c322d':undefined}}>
  {src.endsWith('.jpg')?<Picture src={src} style={{width:'100%',height:'100%'}}/>:<OffthreadVideo src={staticFile(src)} playbackRate={rate} muted style={{width:'100%',height:'100%'}}/>}
 </div>;
}
export function V3Pile() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}>
  <Picture src="art/laundry-expedition.png" style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${interpolate(f,[0,89],[1,1.075],clamp)})`,transformOrigin:'72% 70%'}}/>
  <div style={{position:'absolute',left:110,top:310,width:790,color:'white',fontSize:99,lineHeight:1.03,letterSpacing:-3}}>That pile’s been<br/>there since<br/><span style={{color:'#ffb452'}}>Tuesday.</span></div>
 </AbsoluteFill>;
}
export function V3Basky() {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{...base,background:'#101d29'}}>
  <div style={{position:'absolute',left:860,top:-190,width:900,height:1600,maskImage:'linear-gradient(90deg,transparent,black 12%,black 95%,transparent)'}}><OffthreadVideo src={staticFile('laundry-room-free-attempt.mp4')} trimBefore={.6*fps} muted style={{width:'100%',height:'100%'}}/></div>
  <div style={{position:'absolute',left:110,top:355,width:800,color:'white',fontSize:99,lineHeight:1.05,letterSpacing:-3}}>Basky’s taking<br/>it personally.</div>
  <div style={{position:'absolute',left:115,top:615,fontSize:34,color:'#ffbf6b'}}>Your laundry. His next expedition.</div>
 </AbsoluteFill>;
}
export function V3Entry() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}><Scenery veil/>
  <AppCamera src="recordings/v3/entry.mp4" width={interpolate(f,[0,32,80],[480,480,920],smooth)} top={interpolate(f,[0,32,80],[65,65,-105],smooth)}/>
  <SceneTop>01 / OPEN YOUR CLIMB</SceneTop>
  <Caption>One pile. One climb. A few items at a time.</Caption>
 </AbsoluteFill>;
}
function BankCrop({x,y,w,h,width}: {x:number;y:number;w:number;h:number;width:number}) {
 const scale=width/w;
 return <div style={{width,height:h*scale,overflow:'hidden',position:'relative'}}><Picture src="recordings/v3/bank.jpg" style={{position:'absolute',width:960*scale,height:1862*scale,maxWidth:'none',left:-x*scale,top:-y*scale}}/></div>;
}
export function V3Photo() {
 const f=useCurrentFrame(); const t=f/30;
 const after=t>1.4; const suggested=t>2.6; const corrected=t>3.9;
 const row={background:'white',border:'2px solid #dfE6e8',borderRadius:22,overflow:'hidden'};
 return <AbsoluteFill style={base}><Scenery veil/><SceneTop concept>02 / SNAP. FOLD. SNAP AGAIN.</SceneTop>
  <div style={{position:'absolute',left:435,top:100,width:1050,height:860,background:'white',borderRadius:32,boxShadow:'0 14px 60px #08243b24',padding:'24px 42px',boxSizing:'border-box'}}>
   <div style={{width:65,height:7,borderRadius:10,background:'#c6d2d3',margin:'0 auto 16px'}}/>
   <div style={{textAlign:'center',fontSize:17,letterSpacing:4,color:'#426274'}}>A LITTLE LESS LAUNDRY</div>
   <div style={{textAlign:'center',fontSize:55,letterSpacing:-1,margin:'9px 0 4px'}}>What have you conquered?</div>
   <div style={{display:'flex',justifyContent:'center'}}><BankCrop x={30} y={874} w={900} h={168} width={960}/></div>
   <div style={{display:'flex',gap:16,marginTop:18}}>
    <div style={{...row,flex:1,height:184,position:'relative'}}><Picture src={photo} style={{position:'absolute',width:928,height:464,maxWidth:'none',left:0,top:-125}}/><span style={{position:'absolute',left:14,bottom:10,padding:'4px 12px',background:'white',borderRadius:12,fontSize:23}}>Before</span></div>
    <div style={{...row,flex:1,height:184,position:'relative',background:'#eef5f4'}}>{after?<Picture src={photo} style={{position:'absolute',width:928,height:464,maxWidth:'none',left:-464,top:-125}}/>:<div style={{textAlign:'center',paddingTop:57,fontSize:27,color:'#698079'}}>Fold a few. Then snap.</div>}<span style={{position:'absolute',left:14,bottom:10,padding:'4px 12px',background:'white',borderRadius:12,fontSize:23}}>After</span></div>
   </div>
   <div style={{textAlign:'center',fontSize:24,marginTop:15,color:'#426274'}}>{corrected?'Count checked by you':suggested?'Suggested count · check before banking':'Your before & after'}</div>
   <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:42,height:145}}>
    <div style={{background:'linear-gradient(#00ae82,#00715a)',borderRadius:'50%',width:75,height:75,textAlign:'center',lineHeight:'69px',color:'white',fontSize:50}}>−</div>
    <div style={{fontSize:119,lineHeight:1,width:150,textAlign:'center'}}>{suggested?(corrected?'20':'18'):'—'}</div>
    <div style={{background:'linear-gradient(#00ae82,#00715a)',borderRadius:'50%',width:75,height:75,textAlign:'center',lineHeight:'69px',color:'white',fontSize:50,boxShadow:corrected?'0 0 0 8px #aee5d3':'none'}}>+</div>
   </div>
   <div style={{height:27,textAlign:'center',fontSize:23,marginBottom:16}}>{suggested?`Your basket climbs ${corrected?'200':'180'} m.`:'You have the final say.'}</div>
   <div style={{background:'linear-gradient(#00ae82,#00715a)',borderRadius:40,textAlign:'center',padding:'15px',fontSize:34,color:'white',boxShadow:'inset 0 3px 0 #91dfc9,0 5px 8px #103a2d20'}}>Confirm &amp; climb {suggested?`+${corrected?'200':'180'} m`:'↑'}</div>
  </div>
  <Caption>A photo estimate. You check the count.</Caption>
 </AbsoluteFill>;
}
export function V3Bank() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}><Scenery veil/>
  <AppCamera src="recordings/v3/bank.mp4" rate={.70} width={interpolate(f,[0,45,105],[700,880,950],smooth)} top={interpolate(f,[0,45,105],[-470,-620,-835],smooth)}/>
  <SceneTop>03 / BANK THE ITEMS YOU FINISHED</SceneTop>
  <Caption>Twenty items done? Bank them.</Caption>
 </AbsoluteFill>;
}
export function V3Climb() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}><Scenery veil/>
  <AppCamera src="recordings/v3/climb.mp4" rate={.60} width={interpolate(f,[0,75,125],[970,970,850],smooth)} top={interpolate(f,[0,75,125],[-70,-70,-120],smooth)}/>
  <SceneTop>04 / EVERY ITEM EARNS 10 METRES</SceneTop>
  <Caption>200 metres for him. Less laundry for you.</Caption>
 </AbsoluteFill>;
}
export function V3Reward() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{...base,background:'#052641'}}>
  <Scenery src="art/reference-badge-reveal.webp"/><AbsoluteFill style={{background:'#001b34a8'}}/>
  <AppCamera src="recordings/v3/badge.mp4" width={interpolate(f,[0,80],[540,630],smooth)} top={interpolate(f,[0,80],[20,-80],smooth)} border={false}/>
  <Caption dark>A badge. For doing the laundry.</Caption>
 </AbsoluteFill>;
}
export function V3Saved() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}><Scenery veil/>
  <AppCamera src="recordings/v3/results.jpg" width={interpolate(f,[0,35,100],[570,570,880],smooth)} top={interpolate(f,[0,35,100],[20,20,-675],smooth)}/>
  <SceneTop>05 / YOUR CLIMB IS SAVED</SceneTop>
  <Caption>The next load takes you higher.</Caption>
 </AbsoluteFill>;
}
function SummitPhone({src,x,delay}: {src:string;x:number;delay:number}) {
 const f=useCurrentFrame();
 return <div style={{position:'absolute',left:x,top:130+interpolate(f,[delay,delay+18],[90,0],smooth),width:430,height:790,borderRadius:30,overflow:'hidden',background:'white',boxShadow:'0 14px 30px #08243b40',opacity:interpolate(f,[delay,delay+10],[0,1],clamp)}}><Picture src={src} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/></div>;
}
export function V3Summits() {
 return <AbsoluteFill style={base}><Scenery veil/><SceneTop>BEN NEVIS → MOUNT FUJI → EVEREST</SceneTop>
  <SummitPhone src="captures/ben-home.jpg" x={235} delay={0}/>
  <SummitPhone src="recordings/fuji-clear.jpg" x={745} delay={6}/>
  <SummitPhone src="recordings/everest-clear.jpg" x={1255} delay={12}/>
  <Caption>There’s always another mountain of washing.</Caption>
 </AbsoluteFill>;
}
export function V3End() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={base}><Scenery/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,#f3fcfff5,#effbffdb 60%,#e3f1f035)'}}/>
  <Picture src="art/reference-logo.webp" style={{position:'absolute',width:670,height:670,objectFit:'contain',left:625,top:40,transform:`scale(${interpolate(f,[0,65],[.93,1],smooth)})`}}/>
  <div style={{position:'absolute',left:0,right:0,top:733,textAlign:'center',fontSize:88,lineHeight:1,letterSpacing:-3,color:navy}}>Less pile. <span style={{color:green}}>More peak.</span></div>
  <div style={{position:'absolute',left:0,right:0,top:865,textAlign:'center',fontSize:34,color:navy}}>Meet your laundry halfway. Basky’ll handle the altitude.</div>
 </AbsoluteFill>;
}
export const DemoV3=()=> {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Series>
  <Series.Sequence name="01 — That pile" durationInFrames={90} premountFor={fps}><V3Pile/></Series.Sequence>
  <Series.Sequence name="02 — Basky" durationInFrames={75} premountFor={fps}><V3Basky/></Series.Sequence>
  <Series.Sequence name="03 — Open the actual app" durationInFrames={90} premountFor={fps}><V3Entry/></Series.Sequence>
  <Series.Sequence name="04 — Photo feature concept" durationInFrames={150} premountFor={fps}><V3Photo/></Series.Sequence>
  <Series.Sequence name="05 — Count and confirm" durationInFrames={138} premountFor={fps}><V3Bank/></Series.Sequence>
  <Series.Sequence name="06 — Actual climb" durationInFrames={126} premountFor={fps}><V3Climb/></Series.Sequence>
  <Series.Sequence name="07 — Actual badge" durationInFrames={90} premountFor={fps}><V3Reward/></Series.Sequence>
  <Series.Sequence name="08 — Saved result" durationInFrames={120} premountFor={fps}><V3Saved/></Series.Sequence>
  <Series.Sequence name="09 — Three summits" durationInFrames={90} premountFor={fps}><V3Summits/></Series.Sequence>
  <Series.Sequence name="10 — Laundry Mountain" durationInFrames={120} premountFor={fps}><V3End/></Series.Sequence>
 </Series></AbsoluteFill>;
};
