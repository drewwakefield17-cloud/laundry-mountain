import {AbsoluteFill} from 'remotion';
import {Brand,Headline,Rise,World} from './style';
export const Opening=()=> <AbsoluteFill style={{background:'#091b29',fontFamily:'Nunito',overflow:'hidden'}}>
 <World src="art/laundry-expedition.png"/>
 <AbsoluteFill style={{background:'linear-gradient(90deg,#05192966,transparent 60%)'}}/>
 <div style={{position:'absolute',left:112,top:60}}><Brand small/></div>
 <div style={{position:'absolute',left:120,top:330,width:830}}>
  <Rise><Headline size={144}>Laundry.<br/>Again.</Headline></Rise>
  <Rise at={.6} style={{fontSize:35,color:'#e6eff5',marginTop:42}}>The pile’s getting ideas.</Rise>
 </div>
</AbsoluteFill>;
