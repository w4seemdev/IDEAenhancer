// A small bank of fun, varied seed ideas. Used to seed the input with a
// one-click "surprise me" example so a first-time visitor never faces a blank
// box. Keep them short, concrete, and across different domains.

export const EXAMPLE_SEEDS: string[] = [
  'an app that turns my grocery receipts into recipes',
  'a dating app but only for finding cofounders',
  'a plant that texts me when it needs water',
  'subscription socks that match my calendar',
  'a noise cancelling app for open plan offices',
  'a board game that teaches kids to invest',
  'an AI that writes apology notes in my voice',
  'a map of every free public piano in the city',
];

/** Return a random example seed. */
export function randomExample(): string {
  const i = Math.floor(Math.random() * EXAMPLE_SEEDS.length);
  return EXAMPLE_SEEDS[i];
}
