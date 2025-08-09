// Simple Epsilon-Greedy Multi-Armed Bandit implementation.
// This helps in A/B testing different recommendation strategies.

/**
 * Chooses a variant (arm) for an experiment.
 * @param epsilon - The probability of exploring (choosing a random arm). Typically 0.1.
 * @param ctrs - An array of click-through rates for each variant.
 * @returns The index of the chosen variant.
 */
export function chooseVariant(epsilon: number, ctrs: number[]): number {
    if (Math.random() < epsilon || ctrs.every(ctr => ctr === 0)) {
      // Explore: choose a random arm
      return Math.floor(Math.random() * ctrs.length);
    } else {
      // Exploit: choose the best-performing arm so far
      return ctrs.indexOf(Math.max(...ctrs));
    }
  }
  
  // Example usage:
  // const variants = [
  //   { name: 'Vector Search Only', ctr: 0.05 },
  //   { name: 'Vector + Keyword', ctr: 0.07 },
  // ];
  // const ctrValues = variants.map(v => v.ctr);
  // const chosenIndex = chooseVariant(0.1, ctrValues);
  // console.log(`Chosen Variant: ${variants[chosenIndex].name}`);