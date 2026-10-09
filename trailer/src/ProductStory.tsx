import React from 'react';
import {AbsoluteFill,CanvasImage,Easing,interpolate,Series,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {BaskyWide} from './LandscapeEdit';
import {PhotoWalkthrough} from './PhotoWalkthrough';
import {clamp,Phone} from './style';

// Each clean take has fixed source boundaries. No navigation tails or slowed trims.
const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};
const base:React.CSSProperties={fontFamily:'Nunito',fontWeight:900,color:'white',background:'#071b42',overflow:'hidden'};
function Hit({children,at=0,accent=false,style={}}:{children:React.ReactNode;at?:number;accent?:boolean;style?:React.CSSProperties}){
 const f=useCurrentFrame();
 return <div style={{opacity:interpolate(f,[at,at+3],[0,1],clamp),translate:`0 ${interpolate(f,[at,at+10],[28,0],ease)}px`,scale:interpolate(f,[at,at+6,at+11],[.86,1.035,1],clamp),transformOrigin:'left center',color:accent?'#b8f0d9':'inherit',...style}}>{children}</div>;
}
function Backdrop({mountain='ben',light=false}:{mountain?:string;light?:boolean}){
 const {fps}=useVideoConfig();
 return <AbsoluteFill><CanvasImage src={staticFile(mountain==='ben'?'art/landing-highland-wide.webp':`art/playable-${mountain}-landscape.webp`)} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover'}}/><AbsoluteFill style={{background:light?'linear-gradient(90deg,#f4fbfff2,#f4fbffbf 48%,#f4fbff11 80%)':'linear-gradient(90deg,#061a32eb,#061a32bd 49%,#061a3225 81%)'}}/></AbsoluteFill>;
}
function StepCopy({lines,detail,eyebrow,top=220,detailSize=42}:{lines:string[];detail:string;eyebrow?:string;top?:number;detailSize?:number}){
 const f=useCurrentFrame();
 return <div style={{position:'absolute',left:100,top,width:1050}}>
  {eyebrow&&<Hit style={{fontSize:29,color:'#ffc26c',marginBottom:23,letterSpacing:2}}>{eyebrow}</Hit>}
  <div style={{fontSize:132,letterSpacing:-4,lineHeight:1.035,textShadow:'0 4px 24px #04172866'}}>{lines.map((line,i)=><Hit key={line} at={i*7} accent={i===lines.length-1} style={{whiteSpace:'nowrap',...(i===lines.length-1?{fontFamily:'Summit Block',fontSize:line.length>13?108:126,letterSpacing:-4}:{})}}>{line}</Hit>)}</div>
  <div style={{height:7,width:interpolate(f,[14,25],[0,190],ease),background:'#ffb452',borderRadius:5,marginTop:28}}/>
  <Hit at={15} style={{fontSize:detailSize,lineHeight:1.2,marginTop:25,maxWidth:965,color:'#e9f7ff'}}>{detail}</Hit>
 </div>;
}
function PortraitFootage({src}:{src:string}){
 const {fps}=useVideoConfig();
 return <Phone x={1220} y={68} width={448} aspectRatio={.5}><Video name={src} src={staticFile(`recordings/polished/${src}.mp4`)} premountFor={fps} muted style={{width:'100%',height:'100%'}}/></Phone>;
}
function Opening({reaction=false}:{reaction?:boolean}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}>
  <CanvasImage src={staticFile(reaction?'art/basky-takes-it-personally.png':'art/laundry-expedition.png')} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(f,[0,15],reaction?[1.065,1.11]:[1,1.07],ease),transformOrigin:'70% 70%'}}/>
  <div style={{position:'absolute',left:100,top:270,width:920,fontSize:109,lineHeight:1.04,letterSpacing:-4,textShadow:'0 4px 22px #04172999'}}>
   {reaction?<><Hit at={0} style={{fontSize:138}}>Basky</Hit><div style={{display:'flex',gap:28}}><Hit at={5}>takes</Hit><Hit at={10}>it</Hit></div><Hit at={15} style={{fontFamily:'Summit Block',fontSize:132,color:'#ffb452'}}>personally.</Hit></>:<><Hit>That pile’s been</Hit><Hit at={4}>there since</Hit><Hit at={8} style={{fontSize:150,color:'#ffb452'}}>Tuesday.</Hit></>}
   <div style={{width:interpolate(f,[17,25],[0,reaction?815:630],ease),height:9,background:'#ffb452',borderRadius:5,marginTop:12}}/>
  </div>
 </AbsoluteFill>;
}
function Introduce(){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Backdrop light/>
  <Hit at={0} style={{position:'absolute',left:120,top:75,width:1040,fontSize:88,letterSpacing:-2,color:'#071b42',textAlign:'center',transformOrigin:'center'}}>Introducing</Hit>
  <CanvasImage src={staticFile('art/reference-logo.webp')} premountFor={fps} style={{position:'absolute',left:265,top:140,width:710,height:640,objectFit:'contain',opacity:interpolate(f,[8,10],[0,1],clamp),scale:interpolate(f,[8,15,20],[.65,1.07,1],clamp)}}/>
  <Hit at={23} style={{position:'absolute',left:75,top:800,width:1090,textAlign:'center',fontSize:73,lineHeight:1.08,color:'#071b42',letterSpacing:-2,transformOrigin:'center'}}>Conquer your pile of laundry.<br/><span style={{color:'#00765d'}}>One load at a time.</span></Hit>
  <Phone src="captures/ben-home.jpg" x={1240} y={85} width={418}/>
 </AbsoluteFill>;
}
function StartSession(){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Backdrop/><StepCopy top={150} lines={['Start your next','laundry session.']} detail="Basky’s ready when you are." detailSize={53}/>
  <CanvasImage src={staticFile('art/coordinated-basket-cheer.webp')} premountFor={fps} style={{position:'absolute',left:570,top:610,width:450,height:450,objectFit:'contain',opacity:interpolate(f,[16,21],[0,1],clamp),scale:interpolate(f,[16,23,29],[.8,1.04,1],clamp),filter:'drop-shadow(0 18px 20px #03142366)'}}/>
  <PortraitFootage src="start"/>
 </AbsoluteFill>;
}
function BankAndClimb(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Video name="Real 25-item climb" src={staticFile('recordings/polished/ben-walk.mp4')} premountFor={fps} muted style={{width:'100%',height:'100%'}}/><Hit style={{position:'absolute',left:30,bottom:18,background:'#071b42f2',borderRadius:24,padding:'10px 25px',fontSize:39}}>25 items. <span style={{color:'#b8f0d9'}}>250 metres higher.</span></Hit></AbsoluteFill>;
}
function Checkpoint(){return <AbsoluteFill style={base}><Backdrop/><StepCopy eyebrow="250 METRES LATER" lines={['First','CHECKPOINT.']} detail="A little less laundry. A little more mountain."/><PortraitFootage src="checkpoint"/></AbsoluteFill>}
function Badge(){return <AbsoluteFill style={base}><Backdrop/><StepCopy lines={['Earn your','STRIPES.']} detail="A badge. For doing the laundry."/><PortraitFootage src="badge"/></AbsoluteFill>}
function Trail(){return <AbsoluteFill style={base}><Backdrop/><StepCopy lines={['Watch your','trail grow.']} detail="Progress saved. Ready for the next load."/><PortraitFootage src="trail"/></AbsoluteFill>}
function BenSummit(){return <AbsoluteFill style={base}><Backdrop/><StepCopy eyebrow="AFTER MORE COMPLETED LOADS" lines={['Conquer','BEN NEVIS.']} detail="1,345 metres climbed. Mount Fuji unlocked."/><PortraitFootage src="ben-summit"/></AbsoluteFill>}
function MountainRun({mountain}:{mountain:'fuji'|'everest'}){
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Video name={`${mountain} uninterrupted walking`} src={staticFile(`recordings/polished/${mountain}-walk.mp4`)} premountFor={fps} muted style={{width:'100%',height:'100%'}}/><Hit at={0} style={{position:'absolute',left:32,bottom:18,background:'#071b42f2',padding:'12px 26px',borderRadius:20,fontSize:44,lineHeight:1.1}}>{mountain==='fuji'?'Next stop: Mount Fuji.':'Then take on Everest.'}</Hit></AbsoluteFill>;
}
function FinalSummit(){return <AbsoluteFill style={base}><Backdrop mountain="everest"/><StepCopy top={205} eyebrow="THE SUMMIT PAYOFF" lines={['Three peaks.','One very smug','laundry basket.']} detail="Your finished loads got him here."/><PortraitFootage src="everest-summit"/></AbsoluteFill>}
function SelectedClosing(){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#07395a',overflow:'hidden'}}><CanvasImage src={staticFile('art/owner-selected-closing.png')} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(f,[0,90],[1,1.025],ease),transformOrigin:'55% 45%'}}/></AbsoluteFill>;
}
export const ProductStory=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={base}><Series>
  <Series.Sequence name="01 — Tuesday pile: quick push" durationInFrames={50} premountFor={fps}><Opening/></Series.Sequence>
  <Series.Sequence name="02 — Basky / takes / it / personally" durationInFrames={40} premountFor={fps}><Opening reaction/></Series.Sequence>
  <Series.Sequence name="03 — Introducing / logo / subtitle" durationInFrames={90} premountFor={fps}><Introduce/></Series.Sequence>
  <Series.Sequence name="04 — Actual Start and Bank taps" durationInFrames={93} premountFor={fps}><StartSession/></Series.Sequence>
  <Series.Sequence name="05 — Before / after / check / confirm — concept" durationInFrames={255} premountFor={fps}><PhotoWalkthrough/></Series.Sequence>
  <Series.Sequence name="06 — 25 items, continuous climb" durationInFrames={66} premountFor={fps}><BankAndClimb/></Series.Sequence>
  <Series.Sequence name="07 — One clear checkpoint" durationInFrames={60} premountFor={fps}><Checkpoint/></Series.Sequence>
  <Series.Sequence name="08 — Glen Explorer: readable hold" durationInFrames={90} premountFor={fps}><Badge/></Series.Sequence>
  <Series.Sequence name="09 — Fully loaded saved trail" durationInFrames={75} premountFor={fps}><Trail/></Series.Sequence>
  <Series.Sequence name="10 — Ben Nevis summit, later loads" durationInFrames={87} premountFor={fps}><BenSummit/></Series.Sequence>
  <Series.Sequence name="11 — Mount Fuji, continuous movement" durationInFrames={69} premountFor={fps}><MountainRun mountain="fuji"/></Series.Sequence>
  <Series.Sequence name="12 — Everest, continuous movement" durationInFrames={69} premountFor={fps}><MountainRun mountain="everest"/></Series.Sequence>
  <Series.Sequence name="13 — Three peaks, one reward screen" durationInFrames={90} premountFor={fps}><FinalSummit/></Series.Sequence>
  <Series.Sequence name="14 — Basky conquers the pile" durationInFrames={78} premountFor={fps}><BaskyWide/></Series.Sequence>
  <Series.Sequence name="15 — Selected sunset closing" durationInFrames={102} premountFor={fps}><SelectedClosing/></Series.Sequence>
 </Series></AbsoluteFill>;
};
