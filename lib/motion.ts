// Shared cubic-bezier easing as a fixed-length tuple so it satisfies
// motion's `Easing` type (a plain number[] is not assignable).
export const EASE = [0.16, 1, 0.3, 1] as const;
