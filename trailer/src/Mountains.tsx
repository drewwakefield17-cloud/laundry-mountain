import {OffthreadVideo} from 'remotion';
import {AbsoluteFill,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,ease,Headline,ink,Kicker,Phone,Rise} from './style';
export const Mountains=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'linear-gradient(135deg,#e9f7f3,#e4f0f8)',fontFamily:'Nunito',overflow:'hidden'}}>
  <div style={{position:'absolute',left:90,top:50}}><Brand small dark/></div>
  <div style={{position:'absolute',left:100,top:295,width:550}}><Rise><Kicker dark>YOUR NEXT PEAK IS WAITING</Kicker><Headline size={96} color={ink}>Keep going.<br/><span style={{color:'#00795e'}}>There’s more<br/>up there.</span></Headline></Rise><Rise at={.5} style={{marginTop:38,fontSize:28,color:'#34596c'}}>Finish a summit.<br/>Unlock the next adventure.</Rise></div>
  <div style={{translate:`0 ${interpolate(f,[0,.5*fps],[140,0],ease)}px`}}><Phone x={735} y={210} width={330} aspectRatio={960/1862} angle={-4}><OffthreadVideo src={staticFile('recordings/ben-nevis.mp4')} muted style={{width:'100%',height:'100%'}}/></Phone></div>
  <div style={{translate:`0 ${interpolate(f,[.1*fps,.6*fps],[140,0],ease)}px`}}><Phone src="recordings/fuji-clear.jpg" x={1120} y={145} width={330} aspectRatio={960/1862}/></div>
  <div style={{translate:`0 ${interpolate(f,[.2*fps,.7*fps],[140,0],ease)}px`}}><Phone src="recordings/everest-clear.jpg" x={1505} y={210} width={330} aspectRatio={960/1862} angle={4}/></div>
  <div style={{position:'absolute',left:750,top:940,width:1110,display:'flex',justifyContent:'space-around',fontSize:26,fontWeight:900,color:ink}}><span>Ben Nevis</span><span>Mount Fuji</span><span>Everest</span></div>
  <div style={{position:'absolute',left:800,bottom:42,fontSize:20,color:'#466a78'}}>Actual phone screens · Preview the next mountain before unlocking it.</div>
 </AbsoluteFill>;
};
