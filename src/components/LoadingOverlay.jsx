import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./LoadingOverlay.css";

function LoadingOverlay() {
    const location = useLocation();
    const [settledLocation, setSettledLocation] = useState(null);
    const [pendingChanges, setPendingChanges] = useState(0);
    const currentLocation = `${location.pathname}${location.search}${location.hash}`;

    useEffect(() => {
        const timeoutId = window.setTimeout(
            () => setSettledLocation(currentLocation),
            350
        );

        return () => window.clearTimeout(timeoutId);
    }, [currentLocation]);

    useEffect(() => {
        const finishRequest = (config) => {
            if (!config?.__globalLoading) return;

            config.__globalLoading = false;
            setPendingChanges((count) => Math.max(0, count - 1));
        };

        const requestInterceptor = axios.interceptors.request.use((config) => {
            if (config.method?.toLowerCase() !== "get") {
                config.__globalLoading = true;
                setPendingChanges((count) => count + 1);
            }

            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                finishRequest(response.config);
                return response;
            },
            (error) => {
                finishRequest(error.config);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const navigationLoading = currentLocation !== settledLocation;
    if (!navigationLoading && pendingChanges === 0) return null;

    return (
        <div
            className="loading-overlay"
            role="status"
            aria-live="polite"
            aria-label={pendingChanges > 0 ? "Applying changes" : "Loading page"}
        >
            <div className="loading-overlay-card">
                <span className="loading-overlay-spinner" aria-hidden="true">
                    <span />
                </span>
                <div className="loading-overlay-copy">
                    <span className="loading-overlay-eyebrow">
                        {pendingChanges > 0 ? "SAVING YOUR WORK" : "GETTING THINGS READY"}
                    </span>
                    <span className="loading-overlay-message">
                        {pendingChanges > 0 ? "Applying your changes" : "Loading your workspace"}
                    </span>
                    <span className="loading-overlay-detail">
                        {pendingChanges > 0
                            ? "This should only take a moment."
                            : "Preparing everything for you."}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LoadingOverlay;
