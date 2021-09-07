const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    createProxyMiddleware("/games",{
      target: "https://api.igdb.com/v4",
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/covers",{
      target: "https://api.igdb.com/v4",
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/genres",{
      target: "https://api.igdb.com/v4",
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/platforms",{
      target: "https://api.igdb.com/v4",
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/websites",{
      target: "https://api.igdb.com/v4",
      changeOrigin: true
    })
  );
};
