import { fork } from 'redux-saga/effects';

import datasetSaga from './dataset/sagas';
import i18nSaga from './i18n/sagas';
import userSaga from './user/sagas';
import parsingSaga from './admin/parsing/sagas';
import publicationSaga from './publication/sagas';
import publishSaga from './admin/publish/sagas';
import uploadFileSaga from './admin/upload/uploadFileSaga';

export default function* () {
    yield fork(datasetSaga);
    yield fork(i18nSaga);
    yield fork(userSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(publishSaga);
    yield fork(uploadFileSaga);
}
