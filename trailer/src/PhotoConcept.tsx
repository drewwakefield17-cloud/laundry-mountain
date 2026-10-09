import {AbsoluteFill,CanvasImage,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Brand,clamp,Headline,ink,Phone,Rise} from './style';
export const PhotoConcept=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;
 const after=t>=1.9;const reviewed=t>=4.25;const banked=t>=5.7;
 return <AbsoluteFill style={{background:'#eef5fa',fontFamily:'Nunito',color:ink,overflow:'hidden'}}>
  <div style={{position:'absolute',left:100,top:45}}><Brand small dark/></div>
  <div style={{position:'absolute',left:300,top:94,padding:'17px 25px',borderRadius:12,background:'#08243b',color:'white',fontSize:25,fontWeight:900}}>PHOTO-COUNTING CONCEPT · PROPOSED FEATURE</div>
  <div style={{position:'absolute',left:115,top:335,width:875}}>
   <Rise><Headline size={94} color={ink}>{t<1.9?<>Next up:<br/>snap the pile.</>:t<3.4?<>Fold it.<br/>Snap it again.</>:t<5.7?<>Review the count.<br/><span style={{color:'#006d56'}}>You have final say.</span></>:<>Pile conquered.<br/><span style={{color:'#006d56'}}>Climb banked.</span></>}</Headline></Rise>
   <div style={{marginTop:42,fontSize:30,color:'#486577',lineHeight:1.4}}>Proposed photo estimate → your correction → progress.</div>
  </div>
  <Phone x={1250} y={74} width={442} aspectRatio={.52}>
   <div style={{padding:27,height:'100%',boxSizing:'border-box',background:'#f8fcff'}}>
    <div style={{fontSize:27,fontWeight:900,marginBottom:24}}>Photo-counting concept</div>
    <div style={{position:'relative',width:'100%',height:370,overflow:'hidden',borderRadius:20}}>
     <AbsoluteFill style={{background:'linear-gradient(#e6f6ed,#bfe9d7)',alignItems:'center',justifyContent:'center',opacity:banked?1:0}}>
      <div style={{fontSize:48,fontWeight:900,color:'#006d56',marginTop:15}}>+200 m</div>
      <CanvasImage src={staticFile('art/coordinated-basket-cheer.webp')} premountFor={fps} style={{height:255,width:255,objectFit:'contain',scale:interpolate(f,[5.7*fps,6.15*fps],[.7,1],clamp),translate:`0 ${interpolate(f,[5.7*fps,6.15*fps],[30,0],clamp)}px`}}/>
     </AbsoluteFill>
     <CanvasImage src={staticFile('art/photo-counting-concept.png')} premountFor={fps} style={{position:'absolute',height:370,width:740,maxWidth:'none',left:after?-370:0,opacity:interpolate(f,[5.7*fps,6.05*fps],[1,0],clamp)}}/>
     {!banked&&<div style={{position:'absolute',left:16,top:15,padding:'6px 13px',borderRadius:30,background:'#f8fcfff5',fontSize:20,fontWeight:900}}>{after?'After folding':'Before folding'}</div>}
     <AbsoluteFill style={{background:'white',opacity:interpolate(f,[1.86*fps,1.92*fps,2.08*fps],[0,.95,0],clamp)}}/>
    </div>
    <div style={{textAlign:'center',marginTop:24}}>
     <div style={{fontSize:23,fontWeight:800}}>{banked?'Batch confirmed':t<3.4?'Your before & after':'Review suggested count'}</div>
     {t<3.4?<div style={{fontSize:21,marginTop:30,color:'#567183'}}>{after?'Ready to review':'Take the first photo'}</div>:<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:28,marginTop:15}}><span style={{fontSize:33}}>−</span><b style={{fontSize:78}}>{reviewed?20:18}</b><span style={{fontSize:33,color:reviewed?'#007e62':ink}}>+</span></div>}
     <div style={{height:30,fontSize:21,marginTop:10,color:'#356359'}}>{t>=3.4?(reviewed?'Corrected by you':'Example AI estimate'):''}</div>
     <div style={{marginTop:26,padding:19,borderRadius:32,background:'linear-gradient(#008565,#006c54)',color:'white',fontSize:23,fontWeight:900}}>{banked?'✓ +200 m banked':t<1.9?'Snap the pile':t<3.4?'Snap the folded items':'Confirm & climb'}</div>
    </div>
   </div>
  </Phone>
  <div style={{position:'absolute',left:117,bottom:92,fontSize:25,color:'#456170'}}>Concept animation. Photo recognition is not yet in the app.</div>
 </AbsoluteFill>;
};
