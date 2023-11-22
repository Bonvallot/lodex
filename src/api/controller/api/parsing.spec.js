import { getExcerpt } from './parsing';

describe('parsing', () => {
    it('should call ctx.dataset getExcerpt and count and return their result', async () => {
        const getExcerptCall = [];
        const countCall = [];
        const precomputedCall = [];
        const ctx = {
            dataset: {
                getExcerpt(...args) {
                    getExcerptCall.push(args);
                    return Promise.resolve('getExcerpt Result');
                },
                count(...args) {
                    countCall.push(args);
                    return Promise.resolve('count Result');
                },
            },
            precomputed: {
                findAll(...args) {
                    precomputedCall.push(args);
                    return Promise.resolve('precomputed Result');
                },
            },
        };
        await getExcerpt(ctx);
        expect(ctx.body).toEqual({
            excerptLines: 'getExcerpt Result',
            totalLoadedLines: 'count Result',
            precomputed: 'precomputed Result',
        });
    });
});
