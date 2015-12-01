"use latest";

module.exports = (ctx, req, res) => {
  const end = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  if (!ctx.data.connection) {
    return end(500, { message: 'The Auth0 AD/LDAP Connection is missing.' });
  }
  if (!ctx.data.AUTH0_DOMAIN || !ctx.data.AUTH0_GLOBAL_CLIENT_ID || !ctx.data.AUTH0_GLOBAL_CLIENT_SECRET) {
    return end(500, { message: 'Auth0 API v1 credentials or domain missing.' });
  }

  const authenticate = (callback) => {
    var body = {
      'client_id':     ctx.data.AUTH0_GLOBAL_CLIENT_ID,
      'client_secret': ctx.data.AUTH0_GLOBAL_CLIENT_SECRET,
      'grant_type':    'client_credentials'
    };

    var tokenUrl = `https://${ctx.data.AUTH0_DOMAIN}/oauth/token`;
    console.log('Authenticating:', tokenUrl);

    request.post({ url:  tokenUrl, form: body }, function (err, resp, body) {
      if (err) return callback(err);
      if (resp.statusCode === 404) return callback(new Error('Unknown Auth0 Client ID.', 404));
      if (resp.statusCode.toString().substr(0, 1) !== '2') return callback(new Error(body, resp.statusCode));
      callback(null, JSON.parse(body)['access_token']);
    });
  };

  const monitor = function() {
    authenticate(function(err, token) {
      if (err) {
        console.log('Error authenticating:', err.message);
        return end(500, { message: 'Error authenticating to the Auth0 API.', details: err.message });
      }

      var monitorUrl = `https://${ctx.data.AUTH0_DOMAIN}/api/connections/${ctx.data.connection}/socket`;
      console.log('Monitoring:', monitorUrl);

      request.get({ url:  monitorUrl, headers: { 'Authorization': `Bearer ${token}`} }, function (err, resp, body) {
        if (err) return end(500, { message: 'Error calling the monitoring endpoint.', details: err.message });
        else if (resp.statusCode === 404) return end(400, { message: 'The connector is offline.' });
        else if (resp.statusCode === 200) return end(200, { message: 'The connector is online.' });
        else return end(500, { message: 'Unexpected status received from Auth0.', statusCode: resp.statusCode });
      });
    });
  };

  monitor();
};
