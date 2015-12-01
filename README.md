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

> You can get your Global Client Id/Secret here: https://auth0.com/docs/api/v1

## Usage

Once the task has been deployed you can monitor any connector in your account by calling the task like this:

```
GET https://webtask.it.auth0.com/api/run/{YOUR_CONTAINER_NAME}/ldap-connector-health?connection=my-ldap-store
GET https://webtask.it.auth0.com/api/run/{YOUR_CONTAINER_NAME}/ldap-connector-health?connection=my-other-connector
```

Where `connection` is the name of the **AD/LDAP** Connection in Auth0.

The webtask will return the following:

 - **500**: Infrastructure error (configuration missing, authentication error, ...).
 - **400**: Connector is offline.
 - **200**: Connector is online.

Since the webtask is now handling the "complex logic" (authentication, parsing the response, ...) you can now use any monitoring service like Pingdom, SCOM, Runscope, ... to monitor your AD Connections.
