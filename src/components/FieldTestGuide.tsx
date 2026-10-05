import { useState } from 'react'
import type { ReactNode } from 'react'

export interface GuideSession {
  active: boolean
  kind?: 'folding' | 'negative-control'
  elapsed: number
  count: number
  stage?: string
  reason?: string
  reportKind?: 'folding' | 'negative-control'
  reportSeconds?: number
  returnCheck?: 'waiting' | 'passed' | 'failed'
  savedMetres?: number
}
export type SetupStage = 'camera' | 'permission' | 'framing' | 'clear' | 'calibrating' | 'ready'
export function testInstruction(setup: SetupStage, session: GuideSession) {
  if (session.active && session.kind === 'negative-control') {
    const remaining = Math.max(0, 120 - session.elapsed)
    return { step: 6, title: remaining ? `Negative control · ${remaining}s left` : 'Two minutes reached', text: session.elapsed < 40 ? 'Pause with your hands away from the table. Do not fold or place an item. Any detection here is a false event.' : session.elapsed < 80 ? 'Wave and reach around the workspace without folding or completing an item. Keep the phone still.' : session.elapsed < 120 ? 'Rearrange the source pile without moving an item through a full fold-and-placement cycle.' : 'Tap Finish test. Record any false events and download this report.', detail: `${session.count} false events logged · no metres awarded` }
  }
  if (session.active) {
    const actions: Record<string, string> = {
      ready: 'Take one item from the pickup zone and put it in Fold here.',
      source: 'Bring that item into Fold here, then fold it normally.',
      working: 'Finish folding, then move the whole item into Completed.',
      placement: 'Withdraw your hands and leave Fold here empty. Wait for the item to count.',
      cooldown: 'Item detected. Wait for Ready before taking the next item.',
    }
    return { step: 4, title: 'Fold 20 real items', text: actions[session.stage ?? 'ready'] ?? session.reason ?? actions.ready, detail: `${session.count} automatic detections · finish after 20 physical items, even if the counter is wrong` }
  }
  if (session.returnCheck) return { step: 7, title: session.returnCheck === 'waiting' ? 'Leave, return and check your position' : session.returnCheck === 'passed' ? 'Saved position restored' : 'Saved position did not match', text: session.returnCheck === 'waiting' ? `Your saved position is ${session.savedMetres} m. Leave this app, return to the same URL in Edge, then tap Reload and check.` : session.returnCheck === 'passed' ? `The saved ledger restored the same ${session.savedMetres} m. Tell us your correct detections / 20, misses, duplicates, false events and analysis FPS; include both downloaded reports.` : 'Report the mismatch. Keep your downloaded reports; do not clear browser data.', detail: 'Field test only · physical detection accuracy still needs your assessment' }
  if (session.reportKind === 'negative-control') {
    if ((session.reportSeconds ?? 0) < 120) return { step: 6, title: 'Control stopped early', text: `This run lasted ${session.reportSeconds ?? 0} seconds. Download it, then retry the full two-minute control. Re-enable and calibrate the camera first if it stopped.`, detail: 'An interrupted run does not satisfy the two-minute test' }
    return { step: 7, title: 'Save the control result', text: 'Download the negative-control report. Then tap Check saved position to get the leave-and-return instructions.', detail: 'A zero false-event result is the target, not an assumed pass' }
  }
  if (session.reportKind === 'folding') return { step: 5, title: 'Record the folding result', text: 'Download the folding report. Note correct detections out of 20, misses and duplicates. Then start the two-minute negative control without processing any laundry.', detail: 'The total detection count alone does not establish accuracy' }
  const instructions = {
    camera: { step: 1, title: 'Set up your front camera', text: 'Rotate to landscape. Prop the phone securely with its screen facing you and the front lens tilted down at the table, then tap Enable camera. Keep this guide on screen as you go.' },
    permission: { step: 1, title: 'Allow the camera in Edge', text: 'Accept the browser camera prompt. We use no microphone and do not save or upload footage.' },
    framing: { step: 2, title: 'Frame your workspace', text: 'See the pickup spot, folding area and completed area. The whole pile need not fit. Move the phone further away with its screen facing you. Use Flip view if left and right feel confusing. Adjust zones, then tap My workspace fits.' },
    clear: { step: 3, title: 'Clear the two working areas', text: 'Leave Fold here and Completed empty. The source pile can stay in place. Withdraw your hands and tap Calibrate empty work area.' },
    calibrating: { step: 3, title: 'Capturing the empty areas', text: 'Keep the phone still and your hands outside Fold here and Completed for about two seconds. If calibration times out, follow the retry message.' },
    ready: { step: 4, title: 'You are ready to start', text: 'Check Fold here and Completed were empty during calibration. Tap Start folding now. The next instructions will follow your folding movements.' },
  }
  return { ...instructions[setup], detail: 'Field-test instructions · no manual taps are needed to count items' }
}

export function FieldTestGuide({ setup, session, children }: { setup: SetupStage; session: GuideSession; children?: ReactNode }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return <button className="show-test-guide" onClick={() => setVisible(true)}>Show test instructions</button>
  const instruction = testInstruction(setup, session)
  return <section className="field-guide" data-testid="field-test-guide" aria-label="Field-test instructions">
    <div className="field-guide-top"><span>FIELD TEST · STEP {instruction.step} OF 7</span><button aria-label="Hide test instructions" onClick={() => setVisible(false)}>Hide</button></div>
    <div role="status" aria-live="polite"><strong>{instruction.title}</strong><p>{instruction.text}</p><small>{instruction.detail}</small></div>
    {children && <div className="field-guide-actions">{children}</div>}
  </section>
}
