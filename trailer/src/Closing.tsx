import {AbsoluteFill} from 'remotion';
import {Brand,Headline,ink,Rise,World} from './style';
export const Closing=()=> <AbsoluteFill style={{background:'#d3eefa',fontFamily:'Nunito',overflow:'hidden'}}>
 <World src="art/landing-highland-wide.webp"/>
 <AbsoluteFill style={{background:'linear-gradient(90deg,#f4fbfff2,#f4fbff99 42%,transparent 69%)'}}/>
 <div style={{position:'absolute',left:110,top:40}}><Brand dark/></div>
 <div style={{position:'absolute',left:125,top:365,width:1100}}>
  <Rise><Headline size={109} color={ink}>Conquer the pile.</Headline></Rise>
  <Rise at={.18}><Headline size={109} color="#006d56">Enjoy the climb.</Headline></Rise>
  <Rise at={.6} style={{fontSize:34,marginTop:38,color:'#244a5b'}}>Start with a few. Basky’s ready.</Rise>
  <Rise at={.9} style={{display:'inline-flex',gap:47,alignItems:'center',marginTop:42,padding:'24px 40px',borderRadius:55,background:'linear-gradient(#008565,#006c54)',boxShadow:'inset 0 3px 0 #ffffff77,0 7px 20px #0a604540',color:'white',fontSize:36,fontWeight:900}}>Start your climb <span>→</span></Rise>
 </div>
</AbsoluteFill>;
