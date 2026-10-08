import { ArrowRight, Basket, Mountain, Sock, ShieldCheck, Check, Leaf } from './GameIcons'
import { ClimbScene } from './ClimbScene'
import { BasketAvatar } from './BasketAvatar'
import './landing.css'

const journeys = [
  ['01', 'Ben Nevis', 'Scotland', '1,345 m', 'Your first climb'],
  ['02', 'Mount Fuji', 'Japan', '3,776 m', 'Future expedition'],
  ['03', 'Everest', 'The Himalayas', '8,849 m', 'Future expedition'],
]

export function LandingPage() {
  return <div className="landing-page">
    <a className="landing-skip" href="#landing-main">Skip to content</a>
    <header className="landing-nav">
      <a className="landing-brand" href="/" aria-label="Laundry Mountain home">
        <img src="/brand/laundry-mountain-emblem.webp" alt="" width="53" height="53" />
        <span>LAUNDRY<strong>MOUNTAIN</strong></span>
      </a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#mountains">The mountains</a><a href="#questions">Good to know</a></nav>
      <a className="landing-link" href="/?view=home">Open the app <ArrowRight size={18}/></a>
    </header>
    <main id="landing-main">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><span/> Small habits. Higher horizons.</p>
          <h1 id="landing-title">Your laundry.<br/>A little <em>adventure.</em></h1>
          <p className="landing-intro">There’s a mountain in that washing pile. Fold an item, earn Laundry Metres, and take your basket one step closer to the summit.</p>
          <a className="landing-cta" href="/?view=welcome">Start your climb <ArrowRight size={22}/></a>
          <p className="landing-reassurance"><ShieldCheck size={17}/> No account. No camera uploads. Your own pace.</p>
          <div className="landing-trail-note"><Sock weight="duotone" size={33}/><p><strong>One sock stop at a time.</strong><span>A cleaner home. A higher you.</span></p></div>
        </div>
        <div className="landing-hero-art">
          <ClimbScene metres={0} variant="landing" sceneryFinish="natural" />
          <div className="landing-location"><Mountain weight="fill" size={23}/><span><small>YOUR FIRST EXPEDITION</small><strong>Ben Nevis, Scotland</strong></span><b>1,345 m</b></div>
          <div className="landing-caption">Real laundry. Higher ground.</div>
        </div>
      </section>
      <div className="landing-values" aria-label="Made for everyday life"><span><Basket size={22}/> A chore worth cheering for</span><span><Mountain size={22}/> Real mountains to explore</span><span><Leaf size={22}/> Progress at your pace</span></div>
      <section className="landing-how" id="how-it-works" aria-labelledby="how-title">
        <div className="landing-section-title"><p className="landing-eyebrow">THE EVERYDAY EXPEDITION</p><h2 id="how-title">From washing pile<br/>to mountain high.</h2><p>No epic workout required. Just you, your phone, and the load you were going to fold anyway.</p></div>
        <ol className="landing-steps">
          <li><span className="step-icon"><Basket weight="duotone" size={39}/></span><small>01 / SETTLE IN</small><h3>Make a start.</h3><p>Start a session, put your phone nearby, and tackle as much laundry as you like.</p></li>
          <li><span className="step-icon"><Check weight="bold" size={37}/></span><small>02 / FOLD & GO</small><h3>Give every fold a purpose.</h3><p>Confirm your completed items to earn Laundry Metres. Your basket walks, your route grows, and the next sock stop gets closer.</p></li>
          <li><span className="step-icon"><Sock weight="duotone" size={39}/></span><small>03 / COME BACK HIGHER</small><h3>Make progress that lasts.</h3><p>Finish a load or take a break. Your position stays saved in this browser, ready for your next climb.</p></li>
        </ol>
        <p className="landing-beta"><strong>Currently in early testing.</strong> Folding detection is still being tested on real phones. Hanging and ironing are planned next.</p>
      </section>
      <section className="landing-mountains" id="mountains" aria-labelledby="mountains-title">
        <div className="landing-section-title"><p className="landing-eyebrow">SMALL LOADS. BIG PLACES.</p><h2 id="mountains-title">A world beyond<br/>the washing basket.</h2><p>Start in the Scottish Highlands. These are real mountains, with their own shapes, landscapes and stories.</p><a className="landing-text-link" href="/?view=mountains">Explore the expeditions <ArrowRight size={20}/></a></div>
        <ol className="landing-journeys">{journeys.map(([number, name, country, height, status]) => <li key={name}><span>{number}</span><div><h3>{name}</h3><p>{country} <span>· {status}</span></p></div><strong>{height}</strong></li>)}</ol>
      </section>
      <section className="landing-questions" id="questions" aria-labelledby="questions-title"><div className="landing-section-title"><p className="landing-eyebrow">GOOD TO KNOW</p><h2 id="questions-title">Less fuss.<br/>More fresh starts.</h2></div><div className="landing-faq">
        <details><summary>What do I need to get started?</summary><p>Your phone and a pile of laundry. Start the timer and confirm each batch as you finish it. No camera setup or item target is needed.</p></details>
        <details><summary>Do I need to photograph my laundry?</summary><p>No. Photos are optional, temporary previews. Counts are confirmed by you; photos are not uploaded or automatically counted in this version.</p></details>
        <details><summary>Will my progress still be here tomorrow?</summary><p>Yes, in the same browser on the same device. Clearing browser data removes local progress. Account backup and cross-device syncing are not connected yet.</p></details>
        <details><summary>Is this a competition?</summary><p>This is your own climb. There are no leaderboards or other climbers to keep up with. Go at your pace.</p></details>
        <details><summary>Is the app ready for every kind of laundry?</summary><p>You can confirm folded, hung or ironed items manually. Ben Nevis is playable; Mount Fuji and Everest are currently previews. Automatic counting is planned.</p></details>
      </div></section>
      <section className="landing-final"><div className="landing-final-basket"><BasketAvatar/></div><div><p className="landing-eyebrow">THE PILE CAN WAIT. YOUR ADVENTURE SHOULDN’T.</p><h2>Every load lifts you higher.</h2><a className="landing-cta" href="/?view=welcome">Meet your mountain <ArrowRight size={21}/></a></div></section>
    </main>
    <footer className="landing-footer"><p><strong>Laundry Mountain</strong><span>Real laundry. Higher ground.</span></p><div><a href="/?view=home">Open app</a><a href="/terrain-credits.html">Terrain & artwork credits</a></div><small>Built one load at a time. Early access.</small></footer>
  </div>
}
