import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./LoadingOverlay.css";

const MINIMUM_CHANGE_LOADING_MS = 1500;

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
            const elapsed = Date.now() - config.__globalLoadingStartedAt;
            const remaining = Math.max(0, MINIMUM_CHANGE_LOADING_MS - elapsed);

            window.setTimeout(() => {
                setPendingChanges((count) => Math.max(0, count - 1));
            }, remaining);
        };

        const requestInterceptor = axios.interceptors.request.use((config) => {
            if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) {
                config.__globalLoading = true;
                config.__globalLoadingStartedAt = Date.now();
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
