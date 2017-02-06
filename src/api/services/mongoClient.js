import { MongoClient } from 'mongodb';
import config from 'config';
import dataset from '../models/dataset';
import uriDataset from '../models/uriDataset';
import publishedDataset from '../models/publishedDataset';
import field from '../models/field';

export default async (ctx, next) => {
    ctx.db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    ctx.dataset = await dataset(ctx.db);
    ctx.uriDataset = await uriDataset(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.field = await field(ctx.db);

    try {
        await next();
    } finally {
        await ctx.db.close();
    }
};
