import expect, { createSpy } from 'expect';

import { uploadMiddleware } from './upload';

describe('upload', () => {
    it('should set status to 500 and body to error message if parsing throw an error', async () => {
        const ctx = {
            dataset: {
                remove: createSpy(),
                count: () => createSpy().andReturn(Promise.resolve('dataset count')),
            },
            field: {
                initializeModel: createSpy().andReturn(Promise.resolve()),
            },
            getParser: createSpy().andThrow(new Error('Parsing error')),
            saveStream: createSpy(),
        };

        await uploadMiddleware(ctx, 'csv');

        expect(ctx.status).toBe(500);
        expect(ctx.body).toBe('Parsing error');
    });

    const myParser = createSpy().andReturn(Promise.resolve({
        name: 'myParser result',
    }));
    const ctx = {
        dataset: {
            remove: createSpy(),
            insertMany: createSpy(),
            count: createSpy().andReturn(Promise.resolve('dataset count')),
        },
        field: {
            initializeModel: createSpy().andReturn(Promise.resolve()),
        },
        getParser: createSpy().andReturn(myParser),
        req: 'req',
        requestToStream: createSpy().andReturn(Promise.resolve('stream')),
        saveStream: createSpy(),
    };

    it('should initialize the model', async () => {
        await uploadMiddleware(ctx, 'csv');

        expect(ctx.field.initializeModel).toHaveBeenCalled();
    });

    it('should call all ctx method in turn and have body set to parser result length', async () => {
        await uploadMiddleware(ctx, 'csv');

        expect(ctx.dataset.remove).toHaveBeenCalledWith({});
        expect(ctx.getParser).toHaveBeenCalledWith('csv');
        expect(ctx.requestToStream).toHaveBeenCalledWith('req');
        expect(myParser).toHaveBeenCalledWith('stream');
        expect(ctx.saveStream).toHaveBeenCalled('myParser result', ctx.dataset.insertMany.bind(ctx.dataset.insertMany));
        expect(ctx.dataset.count).toHaveBeenCalled();
        expect(ctx.body).toEqual({
            totalLines: 'dataset count',
        });
    });
});
