import {OffthreadVideo} from 'remotion';
import {AbsoluteFill,staticFile} from 'remotion';
import {Brand,Headline,Kicker,mint,Phone,Rise,World} from './style';
export const Rewards=()=>{
 return <AbsoluteFill style={{background:'#041d32',fontFamily:'Nunito',overflow:'hidden'}}>
  <World src="art/reference-badge-reveal.webp" dark/>
  <div style={{position:'absolute',left:112,top:60}}><Brand small/></div>
  <div style={{position:'absolute',left:120,top:310,width:950}}>
   <Rise><Kicker>THE LITTLE WINS COUNT</Kicker><Headline size={103}>You did laundry.<br/><span style={{color:mint}}>You earned this.</span></Headline></Rise>
   <Rise at={.35} style={{fontSize:35,color:'#d4e7e8',marginTop:37,lineHeight:1.4}}>Badges. Saved progress.<br/>A reason to come back.</Rise>
  </div>
  <Phone x={1245} y={65} width={460} aspectRatio={960/1862} angle={1}><OffthreadVideo src={staticFile('recordings/rewards.mp4')} muted style={{width:'100%',height:'100%'}}/></Phone>
 </AbsoluteFill>;
};
