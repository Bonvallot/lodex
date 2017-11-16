import { fork } from 'redux-saga/effects';

import setLanguage from './setLanguage';
import initializeLanguage from './initializeLanguage';

export default [
    initializeLanguage,
    setLanguage,
];
