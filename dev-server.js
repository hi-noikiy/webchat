const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');

var webchatApp = require('express')();
var webchatServer = require('https').createServer(require('./devssl'), webchatApp);
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin({port: 9840}));

require('fs').readFile(require('path').join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.centricient', 'ui-override.json'), 'utf8', function (err, data) {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch(e){}
  let webchatData;
  if (parsedData) {
    webchatData = parsedData.find(d => d.name === 'webchat');
  }

  let tenant, cluster;
  const webchatPort = 3000;
  const sdkPort = 3001;
  cluster = 'dev';
  if (webchatData) {
    tenant = webchatData.tenant;
    cluster = webchatData.cluster || cluster;
  }

  tenant = tenant || process.env.TENANT;
  if (!tenant) {
    console.error("\n\nERROR!!! You must provide a tenant to run webchat locally!'\n\n");
    process.exit(1);
  }

  var apiGatewayProxySettings = {
    target: require('./discovery')(tenant).readLocalSettings()['api-gateway'] || 'https://' + tenant + '.' + cluster + '.quiq.sh',
    secure: false,
    headers: {
      Host: tenant + '.quiq.dev:' + webchatPort
    }
  };

  console.log('Proxying to API Gateway at ' + apiGatewayProxySettings.target);

  var proxy = require('http-proxy').createProxyServer(apiGatewayProxySettings);

  var proxyToApiGateway = function (req, res) {
    if (req.url.indexOf('long-polling') !== -1) {
      console.log('Sending long-polling request to server...');
    }

    proxy.web(req, res, apiGatewayProxySettings);
  };

  proxy.on('proxyReqWs', function (proxyReqWs, req, res) {
    console.log('Proxy *WS* Request', proxyReqWs.path);
  });
  // proxy the WS requests
  webchatServer.on('upgrade', function (req, socket, head) {
    console.log('---------- SOCKET CONNECTION UPGRADING ----------');
    proxy.ws(req, socket, head);
  });
  proxy.on('error', function (err, req, res) {
    console.log('Something went wrong during proxy...');
    console.log(err);
  });

  webchatApp.use(require('morgan')('dev'));
  webchatApp.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
  }));
  webchatApp.use('/assets', express.static('assets'));

  webchatApp.get('/app/webchat/bridge*', (req, res) => {
    res.sendFile(path.join(__dirname, './views/bridge.html'));
  });

  webchatApp.get('/app/webchat*', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
  });

  webchatApp.all('/external/*', proxyToApiGateway);
  webchatApp.all('/websocket/*', proxyToApiGateway);
  webchatApp.all('/socket/*', proxyToApiGateway);
  webchatApp.all('/messaging/*', proxyToApiGateway);
  webchatApp.all('/idp/*', proxyToApiGateway);
  webchatApp.all('/server/*', proxyToApiGateway);
  webchatApp.all('/landing', proxyToApiGateway);
  webchatApp.all('/landing/*', proxyToApiGateway);
  webchatApp.all('/session/*', proxyToApiGateway);
  webchatApp.all('/session', proxyToApiGateway);
  webchatApp.all('/sessions', proxyToApiGateway);
  webchatApp.all('/debug', proxyToApiGateway);
  webchatApp.all('/debug/*', proxyToApiGateway);
  webchatApp.all('/web/*', proxyToApiGateway);
  webchatApp.all('/perma/*', proxyToApiGateway);
  webchatApp.all('/app/webchat/*', proxyToApiGateway);
  webchatApp.all('/app/chat-demo/', proxyToApiGateway);
  webchatApp.all('/api/*', proxyToApiGateway);

  webchatServer.listen(webchatPort, function () {
    console.log('Webchat app server running on: https://%s.quiq.dev:%s', tenant, webchatPort);
    console.log('Proxy server ready for clients. \\m/ x__x \\m/');
  });

  // SDK server
  // The sole purpose here is to serve the 'local.html' page on a different port than the webchat app
  // This gives us a realistic cross-domain dev environment
  var sdkApp = require('express')();
  var sdkServer = require('https').createServer(require('./devssl'), sdkApp);

  sdkApp.set('view engine', 'ejs');
  sdkApp.use(require('morgan')('dev'));

  sdkApp.get('/', (req, res) => {
    res.render('./playground', {host: ('https://' + tenant + '.quiq.dev:' + webchatPort)})
  });

  sdkServer.listen(sdkPort, function () {
    console.log('SDK server running on: https://%s.quiq.dev:%s', tenant, sdkPort);
  });
});
