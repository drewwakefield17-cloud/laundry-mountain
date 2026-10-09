import { ArrowRight, ShieldCheck } from './GameIcons'
import './landing.css'

const journeys = [
  ['Ben Nevis', 'Scottish Highlands', '1,345 m', 'Your first climb', '/art/coordinated-home.webp'],
  ['Mount Fuji', 'Japan', '3,776 m', 'Unlock after Ben Nevis', '/art/coordinated-fuji-card.webp'],
  ['Everest', 'The Himalayas', '8,849 m', 'Unlock after Mount Fuji', '/art/coordinated-everest-card.webp'],
]
export function LandingPage() {
  return <div className="landing-page">
    <a className="landing-skip" href="#landing-main">Skip to content</a>
    <header className="landing-nav">
      <a className="landing-brand" href="/" aria-label="Laundry Mountain home"><img src="/brand/laundry-mountain-emblem.webp" alt="" width="48" height="48"/><span>LAUNDRY<strong>MOUNTAIN</strong></span></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#mountains">The mountains</a><a href="#questions">Good to know</a></nav>
      <a className="landing-link" href="/?view=home">Open app <ArrowRight size={18}/></a>
    </header>
    <main id="landing-main" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="landing-title">
        <picture className="landing-hero-art">
          <source media="(min-width: 741px)" srcSet="/art/landing-highland-wide.webp"/>
          <img src="/art/landing-highland-portrait.webp" alt="Your laundry basket companion on a sunlit Highland trail beneath Ben Nevis" width="1024" height="2048" fetchPriority="high"/>
        </picture>
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">YOUR EVERYDAY ADVENTURE</p>
          <h1 id="landing-title">Less pile.<br/><em>More peak.</em></h1>
          <p className="landing-intro">Turn the laundry you finish into<br className="landing-mobile-break"/> a little mountain adventure.</p>
          <a className="landing-cta" href="/?view=welcome">Start your climb <ArrowRight size={22}/></a>
          <p className="landing-reassurance"><ShieldCheck size={18}/> No account. No camera needed.</p>
        </div>
        <a className="landing-trail-sign" href="#mountains"><img src="/art/coordinated-sock-icon.webp" alt="" width="42" height="48"/><span><small>YOUR FIRST ADVENTURE</small><strong>Ben Nevis</strong><span>Scottish Highlands · 1,345 m</span></span><ArrowRight size={22}/></a>
      </section>
      <div className="landing-values" aria-label="Your adventure at a glance"><span><i className="landing-art-icon landing-art-icon-items" aria-hidden="true"/><span><strong>1 item. 10 metres.</strong><small>Every little bit counts.</small></span></span><span><i className="landing-art-icon landing-art-icon-mountain" aria-hidden="true"/><span><strong>Three big adventures.</strong><small>Your pace. Your peaks.</small></span></span><span><i className="landing-art-icon landing-art-icon-badge" aria-hidden="true"/><span><strong>Little wins to collect.</strong><small>A trail worth coming back to.</small></span></span></div>
      <section className="landing-how" id="how-it-works" aria-labelledby="how-title">
        <div className="landing-section-title"><p className="landing-eyebrow">THE EVERYDAY EXPEDITION</p><h2 id="how-title">The pile goes down.<br/>You go up.</h2><p>No epic workout required. Just the laundry you were going to do anyway.</p></div>
        <ol className="landing-steps">
          <li><span className="step-icon landing-art-icon landing-art-icon-items" aria-hidden="true"/><small>01 / A LITTLE LESS LAUNDRY</small><h3>Finish a few.</h3><p>Fold, hang or iron. Start a session and take it one item at a time.</p></li>
          <li><span className="step-icon landing-art-icon landing-art-icon-mountain" aria-hidden="true"/><small>02 / A LITTLE MORE MOUNTAIN</small><h3>Bank your batch.</h3><p>Confirm your finished items. Each earns 10 metres and moves your basket up the trail.</p></li>
          <li><span className="step-icon landing-art-icon landing-art-icon-badge" aria-hidden="true"/><small>03 / SOMETHING TO COME BACK TO</small><h3>Enjoy the view.</h3><p>Sock stops, badges and new summits. Your place is saved for your next little climb.</p></li>
        </ol>
        <p className="landing-honesty">Your count, your climb. You confirm the items; the timer never awards metres.</p>
      </section>
      <section className="landing-showcase" id="inside-the-app" aria-labelledby="showcase-title">
        <div className="landing-section-title"><p className="landing-eyebrow">A FRESH SPIN ON LAUNDRY DAY</p><h2 id="showcase-title">Your basket has<br/>better plans.</h2><p>For once, your washing has somewhere exciting to be.</p></div>
        <div className="landing-phones">
          <figure><div className="landing-phone"><img src="/marketing/ben-nevis-home.jpg" alt="Ben Nevis home screen with the basket, saved progress and session controls" width="390" height="844" loading="lazy"/></div><figcaption><strong>Ben Nevis</strong><span>Your first little climb.</span></figcaption></figure>
          <figure><div className="landing-phone"><img src="/marketing/fuji-session.jpg" alt="Mount Fuji session screen showing completed items, metres climbed and Bank this batch" width="390" height="844" loading="lazy"/></div><figcaption><strong>Mount Fuji</strong><span>The pile goes down. You go up.</span></figcaption></figure>
          <figure><div className="landing-phone"><img src="/marketing/everest-map.jpg" alt="Everest mountain view with the saved basket position and sock checkpoints" width="390" height="844" loading="lazy"/></div><figcaption><strong>Everest</strong><span>Lofty ambitions. Same basket.</span></figcaption></figure>
        </div>
        <p className="landing-showcase-note">Actual app screens. Example progress shown.</p>
      </section>
      <section className="landing-mountains" id="mountains" aria-labelledby="mountains-title">
        <div className="landing-section-title"><p className="landing-eyebrow">SMALL LOADS. BIG PLACES.</p><h2 id="mountains-title">Same basket.<br/>Bigger horizons.</h2><p>From the Highlands to the Himalayas, every summit opens a new adventure.</p></div>
        <ol className="landing-journeys">{journeys.map(([name, place, height, status, art]) => <li key={name}><a href="/?view=mountains" aria-label={`Explore ${name}`}><img src={art} alt="" loading="lazy" width="600" height="400"/><div className="landing-mountain-title"><h3>{name}</h3><p>{place}</p></div><div className="landing-mountain-foot"><span>{status}</span><strong>{height}</strong></div></a></li>)}</ol>
      </section>
      <section className="landing-questions" id="questions" aria-labelledby="questions-title"><div className="landing-section-title"><p className="landing-eyebrow">GOOD TO KNOW</p><h2 id="questions-title">Less fuss.<br/>More fresh starts.</h2></div><div className="landing-faq">
        <details><summary>What do I need to get started?</summary><p>Your phone or computer and a pile of laundry. Start a session, then confirm each batch as you finish it. No sign-up, camera setup or item target is needed.</p></details>
        <details><summary>Do I need to photograph my laundry?</summary><p>No. Photos are optional, temporary previews. Counts are confirmed by you; photos are not uploaded or automatically counted.</p></details>
        <details><summary>Will my progress still be here tomorrow?</summary><p>Yes, in the same browser on the same device. Clearing browser data removes local progress. There’s no account backup or cross-device syncing in this version.</p></details>
        <details><summary>Is this a competition?</summary><p>This is your own climb. There are no leaderboards or other climbers to keep up with. Go at your pace.</p></details>
        <details><summary>What counts as a finished item?</summary><p>A folded, hung or ironed item that you confirm in a batch. Each earns 10 Laundry Metres. Only count newly completed items in each batch; your time and speed don’t affect your progress.</p></details>
      </div></section>
      <section className="landing-final"><img src="/art/coordinated-basket-cheer.webp" alt="" width="200" height="200" loading="lazy"/><div><p className="landing-eyebrow">YOUR NEXT LITTLE WIN IS WAITING.</p><h2>Every load lifts you higher.</h2><a className="landing-cta" href="/?view=welcome">Meet your mountain <ArrowRight size={22}/></a></div></section>
    </main>
    <footer className="landing-footer"><p><strong>Laundry Mountain</strong><span>Real laundry. Higher ground.</span></p><div><a href="/?view=home">Open app</a><a href="/terrain-credits.html">Artwork & credits</a></div><small>Progress saved in this browser. Early access.</small></footer>
  </div>
}
