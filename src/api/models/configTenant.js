import { ObjectId } from 'mongodb';
import omit from 'lodash.omit';
import { castIdsFactory } from './utils';

export default async db => {
    const collection = db.collection('configTenant');

    collection.findOneById = async id =>
        collection.findOne({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.findAll = async () => collection.find({}).toArray();

    collection.findLast = async () => {
        const items = await collection
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        if (items.length) return items[0];

        return null;
    };

    collection.create = async data => {
        const { insertedId } = await collection.insertOne(data);
        return collection.findOne({ _id: insertedId });
    };

    collection.delete = async id =>
        collection.remove({ $or: [{ _id: new ObjectId(id) }, { _id: id }] });

    collection.update = async (id, data) => {
        const objectId = new ObjectId(id);

        return collection
            .findOneAndUpdate(
                {
                    $or: [{ _id: objectId }, { _id: id }],
                },
                {
                    $set: omit(data, ['_id']),
                },
                {
                    returnOriginal: false,
                },
            )
            .then(result => result.value);
    };

    collection.updateStatus = async (id, status, data = {}) => {
        const newData = { status, ...data };
        collection.updateOne(
            {
                $or: [{ _id: new ObjectId(id) }, { _id: id }],
            },
            { $set: newData },
        );
    };

    collection.castIds = castIdsFactory(collection);

    return collection;
};
