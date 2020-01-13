import { call, select } from 'redux-saga/effects';

import { handleExportPublishedDatasetSuccess, open } from './exportPublishedDataset';
import getQueryString from '../../../lib/getQueryString';
import { fromSearch } from '../../selectors';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import downloadFile from '../../../lib/downloadFile';

describe.only('export saga', () => {
    describe('handleExportPublishedDatasetSuccess', () => {
        const saga = handleExportPublishedDatasetSuccess({
            payload: { exportID: 'type' },
        });

        it('should select fromSearch.getAppliedFacets', () => {
            expect(saga.next().value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
        });

        it('should select fromSearch.getQuery', () => {
            expect(
                saga.next([
                    {
                        field: {
                            name: 'aFacet',
                        },
                        value: 'aFacetValue',
                    },
                ]).value,
            ).toEqual(select(fromSearch.getQuery));
        });

        it('should select fromSearch.getSort', () => {
            expect(saga.next('aFilter').value).toEqual(
                select(fromSearch.getSort),
            );
        });

        it('should call getQueryString', () => {
            expect(
                saga.next({ sortBy: 'field', sortDir: 'ASC' }).value,
            ).toEqual(
                call(getQueryString, {
                    match: 'aFilter',
                    facets: [
                        {
                            field: {
                                name: 'aFacet',
                            },
                            value: 'aFacetValue',
                        },
                    ],
                    uri: undefined,
                    sort: {
                        sortBy: 'field',
                        sortDir: 'ASC',
                    },
                }),
            );
        });

        it('should select fromUser.getExportPublishedDatasetRequest', () => {
            expect(saga.next('queryString').value).toEqual(
                select(fromUser.getExportPublishedDatasetRequest, {
                    type: 'type',
                    queryString: 'queryString',
                }),
            );
        });

        it('should fetch request and open the window', () => {
            expect(saga.next('request').value).toEqual(call(open, undefined));
        });
    });
});
