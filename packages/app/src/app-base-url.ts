// In production the app is served under a sub-path (vocably.pro/app), so every
// absolute URL has to be built from <base href> rather than from the origin.
export const appBaseUrl = document.baseURI.replace(/\/+$/, '');
