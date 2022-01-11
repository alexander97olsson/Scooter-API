#### Scrutinizer:
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/alexander97olsson/Scooter-API/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/alexander97olsson/Scooter-API/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/alexander97olsson/Scooter-API/badges/build.png?b=main)](https://scrutinizer-ci.com/g/alexander97olsson/Scooter-API/build-status/main)
#### Travis:
[![Build Status](https://app.travis-ci.com/alexander97olsson/Scooter-API.svg?branch=main)](https://app.travis-ci.com/alexander97olsson/Scooter-API)
# Scooter API

Installation/documentation of API.
This is the backend and server repo for el sparkcyklar.

GitHub repo is published at:

* https://github.com/alexander97olsson/Scooter-API

Documentation:

* https://docs.google.com/document/d/1b51lAyhmb2n8YFrUnwgyALpxFJhnjb_DBkPGWEBg-E0/edit?usp=sharing

### Download with docker-compose:

Link to download docker-compose file
* https://drive.google.com/file/d/1HF4-U0y4tyz2WUOb70xgQZYhkOj-NslV/view?usp=sharing

The server will run on localhost:1337.
Route localhost:1337 will print {"data":{"msg":"Hello world, version ***"}}
If you get that you know its working, you can check which version the program is in with
the same route (version ***).

Start:
```
    docker-compose up -d server
```
End:
```
    docker-compose down
```

### Download with source code:

Download this repo and use that commands below. The server will run on localhost:1337. Route localhost:1337 will print {"data":{"msg":"Hello world, version ***"}}. Dont forget to add a config-folder
with info about (change "***" with your private info):

1. Database-info:
 - "username": "***"
 - "password": "***",
 - "secret": "***",

2. Oauth-info:
 - "clientId": "***",
 - "clientSecret": "***",
 - "redirectUri": "***"

Start:
```
    npm start
```
Test eslint:
```
    npm run eslint
```
Test rest:
```
    npm test
```