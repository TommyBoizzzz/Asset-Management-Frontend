import { useEffect, useRef } from "react";

export default function useIntervalRefresh(
    callback,
    interval = 60_000,
    refreshOnMount = false
) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    
    useEffect(() => {
        let isRefreshing = false;

        const refresh = async (background = true) => {
            if (document.visibilityState !== "visible" || isRefreshing) return;

            isRefreshing = true;
            try {
                await callbackRef.current(background);
            } catch (error) {
                console.error("Background data refresh failed:", error);
            } finally {
                isRefreshing = false;
            }
        };

        const intervalId = window.setInterval(() => refresh(true), interval);
        if (refreshOnMount) refresh(false);

        return () => window.clearInterval(intervalId);
    }, [interval, refreshOnMount]);
}
