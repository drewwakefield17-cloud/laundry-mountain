import {AbsoluteFill, CanvasImage, Easing, interpolate, OffthreadVideo, Series, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {V3End, V3Reward} from './DemoV3';
import {clamp} from './style';

// A short direction review. App footage is a real isolated manual session,
// recorded in the app's landscape layout, not a reconstruction of its UI.
export function ThePile({reaction=false}: {reaction?:boolean}) {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const arrival={...clamp,easing:Easing.bezier(.2,.8,.2,1)};
 const rise=(delay:number)=>({opacity:interpolate(f,[delay,delay+8],[0,1],clamp),transform:`translateY(${interpolate(f,[delay,delay+16],[25,0],arrival)}px)`});
 return <AbsoluteFill style={{background:'#10212d',overflow:'hidden'}}>
  <CanvasImage src={staticFile(reaction?'art/basky-takes-it-personally.png':'art/laundry-expedition.png')} premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${interpolate(f,[0,89],reaction?[1.065,1.10]:[1,1.065],clamp)})`,transformOrigin:'70% 70%'}}/>
  <div style={{position:'absolute',left:105,top:290,width:855,color:'white',fontFamily:'Nunito',fontWeight:900,fontSize:99,lineHeight:1.02,letterSpacing:-3,textShadow:'0 4px 24px #071b4266'}}>
   <div style={rise(0)}>{reaction?'Basky’s taking':'That pile’s been'}</div>
   <div style={rise(5)}>{reaction?'it':'there since'}</div>
   <div style={{...rise(10),position:'relative',display:'inline-block',fontSize:reaction?121:140,color:'#ffb452',letterSpacing:-5,marginTop:6}}>{reaction?'personally.':'Tuesday.'}
    <div style={{position:'absolute',left:3,right:3,bottom:-12,height:7,borderRadius:5,background:'#ffb452',transform:`scaleX(${interpolate(f,[15,30],[0,1],arrival)})`,transformOrigin:'left'}}/>
   </div>
  </div>
 </AbsoluteFill>;
}

export function BaskyWide() {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 // The free generation returned portrait. Follow Basky with a full-frame
 // editorial crop; do not stretch the character or fabricate a wide source.
 const sourceY=interpolate(f,[0,77],[600,490],clamp);
 return <AbsoluteFill style={{background:'#10212d',overflow:'hidden'}}>
  <OffthreadVideo src={staticFile('laundry-room-free-attempt.mp4')} trimBefore={Math.round(.8*fps)} muted style={{position:'absolute',left:0,top:-sourceY*1920/720,width:1920,height:1280*1920/720}}/>
 </AbsoluteFill>;
}

function ActualLandscapeApp() {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#071b42'}}>
  <OffthreadVideo src={staticFile('recordings/landscape-app-demo.webm')} trimBefore={Math.round(2*fps)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 </AbsoluteFill>;
}

export const LandscapeEdit=()=> {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#071b42'}}><Series>
  <Series.Sequence name="01 — That pile’s been there since Tuesday" durationInFrames={90} premountFor={fps}><ThePile/></Series.Sequence>
  <Series.Sequence name="02 — Basky’s taking it personally" durationInFrames={75} premountFor={fps}><ThePile reaction/></Series.Sequence>
  <Series.Sequence name="03 — Real landscape app: bank 20, climb 200 m" durationInFrames={201} premountFor={fps}><ActualLandscapeApp/></Series.Sequence>
  <Series.Sequence name="04 — Earned reward, retained" durationInFrames={90} premountFor={fps}><V3Reward/></Series.Sequence>
  <Series.Sequence name="05 — Payoff: Basky tackles the mountain" durationInFrames={78} premountFor={fps}><BaskyWide/></Series.Sequence>
  <Series.Sequence name="06 — Original logo ending, retained" durationInFrames={120} premountFor={fps}><V3End/></Series.Sequence>
 </Series></AbsoluteFill>;
};
