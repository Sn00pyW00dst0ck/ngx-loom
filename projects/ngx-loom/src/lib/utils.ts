/**
 * Constrains a given value within a given min and max value. 
 * 
 * @param { number } min the minimum value to constrain to
 * @param { number } value the value to constrain
 * @param { number } max the maximum value to constrain to
 * @returns the constrained value in range [min, max].
 */
export const constrain = (min: number, value: number, max: number): number => ((value <= min) ? min : (value >= max) ? max : value);