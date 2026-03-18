import { useEffect } from 'react';

/**
 * Re-fetches data when any mutation fires the pms:data-changed event.
 * @param {Function} fetchFn - The function to call on data change
 */
export function useRefreshOnChange(fetchFn) {
    useEffect(() => {
        window.addEventListener('pms:data-changed', fetchFn);
        return () => window.removeEventListener('pms:data-changed', fetchFn);
    }, [fetchFn]);
}
