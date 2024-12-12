// Helper function to throttle async tasks and avoid repeated requests
let inThrottle = false;
export function throttle(func, limit) {
    return async (...args) => {
        if (!inThrottle) {
            inThrottle = true;
            try {
                await func(...args);
            }
            finally {
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };
}
//# sourceMappingURL=throttle-async.js.map