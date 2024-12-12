// Helper function to throttle async tasks and avoid repeated requests
let inThrottle = false;
export function throttle<T extends unknown[]>(func: (...args: T) => Promise<void>, limit: number): (...args: T) => void {
    return async (...args: T) => {
        if (!inThrottle) {
            inThrottle = true;
            try {
                await func(...args);
            } finally {
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };
}