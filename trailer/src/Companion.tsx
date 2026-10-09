import {OffthreadVideo} from 'remotion';
import {AbsoluteFill,staticFile,useVideoConfig} from 'remotion';
import {Brand,Headline,Kicker,mint,Rise} from './style';
export const Companion=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#07283b',fontFamily:'Nunito',overflow:'hidden'}}>
  <div style={{position:'absolute',left:1110,top:0,width:720,height:1080,overflow:'hidden',maskImage:'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)'}}>
   <OffthreadVideo src={staticFile('laundry-room-free-attempt.mp4')} trimBefore={.4*fps} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/>
  </div>
  <div style={{position:'absolute',left:112,top:60}}><Brand small/></div>
  <div style={{position:'absolute',left:120,top:325,width:930}}>
   <Rise><Kicker>YOU’VE GOT COMPANY</Kicker><Headline size={132}>Meet<br/><span style={{color:mint}}>Basky.</span></Headline></Rise>
   <Rise at={.45} style={{fontSize:39,color:'#d2e6ec',marginTop:38}}>He’s coming with you.</Rise>
  </div>
  <div style={{position:'absolute',left:120,bottom:87,color:'#a8c8d2',fontSize:25}}>A LITTLE HELP CONQUERING THE PILE.</div>
 </AbsoluteFill>;
};
