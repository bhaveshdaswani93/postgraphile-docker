const express = require("express");
const { postgraphile } = require("postgraphile");
const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");
const { makeWrapResolversPlugin } = require('graphile-utils')

const app = express();
const somePlugin = makeWrapResolversPlugin({
  User: {
    async email(resolve, source, args, context, resolveInfo) {
      const result = await resolve();
      return result.toLowerCase();
    },
  },
});

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://user:pass@host:5432/dbname",
    "public",
    {
      watchPg: true,
      graphiql: true,
      // enhanceGraphiql: true,
      appendPlugins: [PgSimplifyInflectorPlugin, somePlugin],
      
    }
  )
);

app.listen(process.env.PORT || 3000);