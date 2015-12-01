# Auth0 - AD/LDAP Connector Health Webtask

A webtask that can monitor the health of your AD Connectors in Auth0.

## Deployment

```
npm i -g wt-cli
wt init
wt create https://raw.githubusercontent.com/sandrinodimattia/auth0-ldap-connector-health-webtask/master/task.js \
    --name ldap-connector-health \
    --secret AUTH0_DOMAIN={YOUR_AUTH0_DOMAIN} \
    --secret AUTH0_GLOBAL_CLIENT_ID={YOUR_AUTH0_GLOBAL_CLIENT_ID} \
    --secret AUTH0_GLOBAL_CLIENT_SECRET={YOUR_AUTH0_GLOBAL_CLIENT_SECRET}
```

