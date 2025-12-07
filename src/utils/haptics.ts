export function vibrate(pattern: number | number[] = 50) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

export const HapticPatterns = {
    Success: [50],
    Warning: [30, 50, 30],
    Error: [50, 50, 50, 50],
    Light: 20,
    Medium: 40,
    Heavy: 60,
};
