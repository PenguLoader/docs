import { Application, Router } from 'https://deno.land/x/oak@v12.1.0/mod.ts';

const exists = async (filename: string) => {
  try {
    await Deno.stat(filename);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
};

const root = `${Deno.cwd()}/dist`;
const app = new Application();

// First we try to serve static files from the _site folder. If that fails, we
// fall through to the router below.
app.use(async (ctx, next) => {
  try {
    const path = `${ctx.request.url.pathname}.html`;
    const isHtml = await exists(`${root}/${path}`);
    await ctx.send({
      root,
      index: 'index.html',
      path: isHtml ? path : undefined,
    });
  } catch {
    //next();
    await ctx.send({
      root,
      path: '/404.html',
    });
  }
});

const router = new Router();

// The /api/time endpoint returns the current time in ISO format.
router.get('/api/time', (ctx) => {
  ctx.response.body = { time: new Date().toISOString() };
});

// After creating the router, we can add it to the app.
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });