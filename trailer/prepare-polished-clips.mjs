import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const ffmpeg=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const portrait=JSON.parse(await readFile(path.join(root,'public/recordings/polish-cues.json'),'utf8'));
const wide=JSON.parse(await readFile(path.join(root,'public/recordings/polish-wide-cues.json'),'utf8'));
const shots=[
 {name:'start',source:'polish-portrait.webm',from:11,duration:3.1},
 {name:'checkpoint',source:'polish-portrait.webm',from:portrait['first-into-the-glen-']+.4,duration:2},
 {name:'badge',source:'polish-portrait.webm',from:portrait['first-glen-explorer']+.4,duration:3},
 {name:'trail',source:'polish-portrait.webm',from:portrait.trail+.6,duration:2.5},
 {name:'ben-summit',source:'polish-portrait.webm',from:portrait['ben-ben-nevis-summit-']+.4,duration:2.9},
 {name:'everest-summit',source:'polish-portrait.webm',from:portrait['everest-everest-summit-']+.4,duration:3},
 {name:'ben-walk',source:'polish-wide.webm',from:wide.ben+.15,duration:2.2},
 {name:'fuji-walk',source:'polish-wide.webm',from:wide.fuji+.1,duration:2.3},
 {name:'everest-walk',source:'polish-wide.webm',from:wide.everest+.1,duration:2.3},
];
const dest=path.join(root,'public/recordings/polished');await mkdir(dest,{recursive:true});
const run=args=>new Promise((resolve,reject)=>{const p=spawn(ffmpeg,args,{windowsHide:true});let err='';p.stderr.on('data',d=>err+=d);p.on('close',code=>code?reject(new Error(err)):resolve());p.on('error',reject)});
for(let i=0;i<shots.length;i+=2)await Promise.all(shots.slice(i,i+2).map(async shot=>{
 await run(['-hide_banner','-loglevel','error','-ss',String(shot.from),'-i',path.join(root,'public/recordings',shot.source),'-t',String(shot.duration+.2),'-frames:v',String(Math.round(shot.duration*30)),'-an','-c:v','libx264','-preset','fast','-crf','17','-r','30','-pix_fmt','yuv420p','-movflags','+faststart','-y',path.join(dest,shot.name+'.mp4')]);
 console.log(shot.name,shot.from,shot.duration);
}));
await writeFile(path.join(dest,'manifest.json'),JSON.stringify({note:'Real isolated demo UI takes; exact-frame re-encoding with no stream-copy boundaries.',shots},null,2));
