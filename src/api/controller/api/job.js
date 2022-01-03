import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { enricherQueue, ENRICHER_QUEUE } from '../../workers/enricher';
import { publisherQueue, PUBLISHER_QUEUE } from '../../workers/publisher';
import clearPublished from '../../services/clearPublished';
import progress from '../../services/progress';

const GRACE_PERIOD = 0;
export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const getJobLogs = async (ctx, queue, id) => {
    if (queue === ENRICHER_QUEUE) {
        ctx.body = await enricherQueue.getJobLogs(id);
    }
};

export const cancelJob = async (ctx, queue) => {
    if (queue === PUBLISHER_QUEUE) {
        await publisherQueue.clean(GRACE_PERIOD, 'wait');
        const activeJobs = await publisherQueue.getActive();
        activeJobs.forEach(job => {
            job.moveToFailed(new Error('cancelled'), true);
        });

        clearPublished(ctx);
        progress.finish();
        ctx.status = 200;
    }
};

const app = new Koa();
app.use(setup);
app.use(route.get('/:queue/:id/logs', getJobLogs));
app.use(route.post('/:queue/cancel', cancelJob));
app.use(koaBodyParser());

export default app;
