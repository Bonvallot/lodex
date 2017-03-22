import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import * as ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

export default (fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('JSONLDObject', { fields }))
        .pipe(ezs('linkDataset', {
            uri: 'http://lod.istex.fr/',
            scheme: 'http://www.w3.org/2004/02/skos/core#inScheme',
        }))
        .pipe(ezs('JSONLDString'));
