import {OffthreadVideo} from 'remotion';
import {AbsoluteFill,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,clamp,ease,Headline,ink,Kicker,Phone,Rise} from './style';
export const Gameplay=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const sec=f/fps;
 return <AbsoluteFill style={{background:'#eff7f6',fontFamily:'Nunito',overflow:'hidden'}}>
  <div style={{position:'absolute',width:1100,height:1100,borderRadius:'50%',right:-210,top:-40,background:'radial-gradient(circle,#c1e6d8,#e2f2ec 62%,transparent 63%)'}}/>
  <div style={{position:'absolute',left:112,top:60}}><Brand small dark/></div>
  <div style={{position:'absolute',left:120,top:285,width:950}}>
   <Rise><Kicker dark>FOLD. HANG. IRON.</Kicker><Headline size={108} color={ink}>{sec<3.4?<>Finish a few.<br/>Bank your batch.</>:<>Watch Basky<br/><span style={{color:'#007f69'}}>climb.</span></>}</Headline></Rise>
   <Rise at={3.4} style={{display:'flex',alignItems:'center',gap:32,marginTop:48,color:ink}}>
    <div style={{fontSize:86,fontWeight:900}}>20<span style={{display:'block',fontSize:27}}>items finished</span></div>
    <div style={{fontSize:54,color:'#13876c'}}>→</div>
    <div style={{fontSize:86,fontWeight:900,color:'#00816c'}}>200 m<span style={{display:'block',fontSize:27}}>higher</span></div>
   </Rise>
   <div style={{position:'absolute',top:540,fontSize:28,color:'#466679'}}>You confirm the count. Every item earns 10 m.</div>
  </div>
  <div style={{translate:`0 ${interpolate(f,[0,.45*fps],[80,0],ease)}px`,opacity:interpolate(f,[0,.2*fps],[0,1],clamp)}}>
   <Phone x={1245} y={65} width={460} aspectRatio={960/1862} angle={-1}>
    <OffthreadVideo src={staticFile('recordings/gameplay.mp4')} muted style={{width:'100%',height:'100%'}}/>
   </Phone>
  </div>
 </AbsoluteFill>;
};
