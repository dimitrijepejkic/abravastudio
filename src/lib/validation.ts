/** Official store listing URL formats. Anything else is rejected at build time. */
export const GOOGLE_PLAY_URL = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[A-Za-z]\w*(\.[A-Za-z]\w*)+$/;
export const APP_STORE_URL = /^https:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[a-z0-9-]+\/id\d+$/;
