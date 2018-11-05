import {
    fork,
    call,
    put,
    select,
    takeLatest,
    throttle,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import {
    LOAD_DATASET_PAGE,
    PRE_LOAD_DATASET_PAGE,
    APPLY_FILTER,
    SORT_DATASET,
    CHANGE_PAGE,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
    clearFilter,
} from './';

import { TOGGLE_FACET_VALUE, CLEAR_FACET, INVERT_FACET } from '../facet';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromDataset, fromFacet } from '../selectors';

export function* handlePreLoadDatasetPage() {
    if (yield select(fromDataset.isDatasetLoaded)) {
        return;
    }

    yield put(loadDatasetPage());
}

export function* handleLoadDatasetPageRequest({ payload }) {
    const facets = yield select(fromFacet.getAppliedFacets);
    const invertedFacets = yield select(fromFacet.getInvertedFacets);
    const match = yield select(fromDataset.getFilter);
    const sort = yield select(fromDataset.getSort);

    let page = payload && payload.page;
    let perPage = payload && payload.perPage;

    if (page === false || typeof page === 'undefined') {
        page = yield select(fromDataset.getDatasetCurrentPage);
    }

    if (!perPage) {
        perPage = yield select(fromDataset.getDatasetPerPage);
    }

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match,
        facets,
        invertedFacets,
        sort,
        page,
        perPage,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadDatasetPageError(error));
        return;
    }

    const { data: dataset, total, fullTotal } = response;

    yield put(loadDatasetPageSuccess({ dataset, page, total, fullTotal }));
}

const clearDatasetSearch = function*() {
    const match = yield select(fromDataset.getFilter);

    if (match) {
        yield put(clearFilter());
    }
};

export default function*() {
    yield fork(function*() {
        // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
        yield throttle(
            500,
            [
                LOAD_DATASET_PAGE,
                APPLY_FILTER,
                TOGGLE_FACET_VALUE,
                CLEAR_FACET,
                INVERT_FACET,
                SORT_DATASET,
                CHANGE_PAGE,
            ],
            handleLoadDatasetPageRequest,
        );
    });
    yield fork(function*() {
        yield takeLatest(PRE_LOAD_DATASET_PAGE, handlePreLoadDatasetPage);
    });

    yield takeLatest(LOCATION_CHANGE, clearDatasetSearch);
}
