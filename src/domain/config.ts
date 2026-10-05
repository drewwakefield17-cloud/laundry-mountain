export const GAME = {
  metresPerItem: 10,
  momentumResetMs: 90_000,
  momentum: [{ items: 20, multiplier: 1.2 }, { items: 10, multiplier: 1.15 }, { items: 5, multiplier: 1.1 }],
  surgeMultiplier: 0.2,
} as const

export const BEN_NEVIS = {
  id: 'ben-nevis', name: 'Ben Nevis', region: 'Scottish Highlands', elevation: 1345,
  palette: { sky: '#dce9e5', distant: '#9cb4ac', rock: '#63756a', grass: '#536a45', forest: '#244e3b' },
  // Stylised game path, never a navigation route.
  route: [[0.16, 0.88], [0.3, 0.78], [0.24, 0.67], [0.46, 0.58], [0.38, 0.49], [0.58, 0.4], [0.53, 0.32], [0.68, 0.23]],
  // Laundry-game milestones, not geographic waypoints or real route elevations.
  checkpoints: [
    { metres: 0, name: 'Base camp', description: 'Every expedition starts with one item.' },
    { metres: 250, name: 'Into the glen', description: 'Small loads are becoming a bigger habit.' },
    { metres: 500, name: 'Lochan lookout', description: 'Take in how far your laundry has brought you.' },
    { metres: 850, name: 'The switchbacks', description: 'Keep your momentum on the rocky upper slopes.' },
    { metres: 1100, name: 'Above the clouds', description: 'The summit is getting closer with every item.' },
    { metres: 1345, name: 'Ben Nevis summit', description: 'A mountain of real laundry, one item at a time.' },
  ],
} as const
