import { DEFAULT_APP_DATA } from './app-data';
export let platform = 'otp_auth_app';
let APP_DATA = DEFAULT_APP_DATA[platform];

export const DEFAULT_CONFIG = {
    appVersion: "0.0.0",
    frontEndUrl: window.location.protocol + "//" + window.location.host + "/",
    api_url: APP_DATA.ubase,
    dev_api_url: APP_DATA.dev_ubase,
};
