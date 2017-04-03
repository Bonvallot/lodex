import Koa from 'koa';
import mount from 'koa-mount';

import dev from './dev';
import prod from './prod';

const app = new Koa();

const middleware = process.env.NODE_ENV === 'development' ? dev() : prod();

app.use(async (ctx, next) => {
    const uri = ctx.path;

    if (!uri.startsWith('/api')
        && uri !== '/admin'
        && uri.indexOf('.js') === -1
        && uri.indexOf('__webpack_hmr') === -1) {
        if (uri.startsWith('/admin')) {
            ctx.path = '/admin';
            await next();
            return;
        }
        // Override the path so that webpack serves the application correctly
        ctx.path = '/';
    }

    await next();
});

app.use(mount(middleware));

export default app;
