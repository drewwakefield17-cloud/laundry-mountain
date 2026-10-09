import {AbsoluteFill,Composition,Folder,useVideoConfig} from 'remotion';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Opening} from './Opening';
import {Companion} from './Companion';
import {Gameplay} from './Gameplay';
import {Rewards} from './Rewards';
import {Mountains} from './Mountains';
import {PhotoConcept} from './PhotoConcept';
import {Closing} from './Closing';
import {DemoV3} from './DemoV3';
import {LandscapeEdit} from './LandscapeEdit';
import {ProductStory} from './ProductStory';
export const LaunchTrailer=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#071f30'}}><TransitionSeries>
  <TransitionSeries.Sequence name="01 — The pile" durationInFrames={75} premountFor={fps}><Opening/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="02 — Meet Basky" durationInFrames={90} premountFor={fps}><Companion/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="03 — Owner's phone demo" durationInFrames={240} premountFor={fps}><Gameplay/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="04 — Earned rewards" durationInFrames={90} premountFor={fps}><Rewards/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="05 — Explore the mountains" durationInFrames={150} premountFor={fps}><Mountains/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="06 — Proposed photo counting" durationInFrames={210} premountFor={fps}><PhotoConcept/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:6})}/>
  <TransitionSeries.Sequence name="07 — Conquer the pile" durationInFrames={135} premountFor={fps}><Closing/></TransitionSeries.Sequence>
 </TransitionSeries></AbsoluteFill>;
};
export const RemotionRoot=()=> <>
 <Composition id="LaundryMountain-Landscape-Edit" component={ProductStory} durationInFrames={1314} fps={30} width={1920} height={1080}/>
 <Composition id="LaundryMountain-Short-Review" component={LandscapeEdit} durationInFrames={654} fps={30} width={1920} height={1080}/>
 <Composition id="LaundryMountain-Demo-v3" component={DemoV3} durationInFrames={1089} fps={30} width={1920} height={1080}/>
 <Composition id="LaundryMountain-Demo-v2" component={LaunchTrailer} durationInFrames={954} fps={30} width={1920} height={1080}/>
 <Folder name="Scenes">
  <Composition id="Opening" component={Opening} durationInFrames={75} fps={30} width={1920} height={1080}/>
  <Composition id="Companion" component={Companion} durationInFrames={90} fps={30} width={1920} height={1080}/>
  <Composition id="Gameplay" component={Gameplay} durationInFrames={240} fps={30} width={1920} height={1080}/>
  <Composition id="Rewards" component={Rewards} durationInFrames={90} fps={30} width={1920} height={1080}/>
  <Composition id="Three-Summits" component={Mountains} durationInFrames={150} fps={30} width={1920} height={1080}/>
  <Composition id="Photo-Counting-Concept" component={PhotoConcept} durationInFrames={210} fps={30} width={1920} height={1080}/>
  <Composition id="Closing" component={Closing} durationInFrames={135} fps={30} width={1920} height={1080}/>
 </Folder>
</>;
