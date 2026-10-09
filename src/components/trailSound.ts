let context: AudioContext | undefined
export function prepareTrailSound() {
  try { context ??= new AudioContext(); void context.resume().catch(() => {}) } catch { /* Sound is optional. */ }
}
export function playTrailReward() {
  if (!context || context.state !== 'running') return
  const at = context.currentTime
  for (const [i, frequency] of [523.25, 659.25, 783.99].entries()) {
    const voice = context.createOscillator(), volume = context.createGain()
    voice.type = 'sine'; voice.frequency.value = frequency
    const start = at + i * .12
    volume.gain.setValueAtTime(0, start)
    volume.gain.linearRampToValueAtTime(.045, start + .015)
    volume.gain.exponentialRampToValueAtTime(.001, start + .42)
    voice.connect(volume); volume.connect(context.destination)
    voice.start(start); voice.stop(start + .45)
    voice.onended = () => { voice.disconnect(); volume.disconnect() }
  }
}
