import { DEFAULT_CONFIG } from '../config/default';

export const environment = {
  production: true,
  api_url: DEFAULT_CONFIG.api_url,
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};
