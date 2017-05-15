ThinkShake API
==========

[API for ThinkShake](https://?/)

## Description
This is the api for ThinkShake.

## Demo

## Requirement
### JavaScript

- [node v7.7.2+](https://nodejs.org/)

## Setup

### On local
#### Install libraries
```npm install```

#### Database Migration
```NODE_ENV=development npm run sequelize db:migrate```

```NODE_ENV=development npm run sequelize db:seed:all```

#### Start dev server to develop
```npm run debug```
[ローカル環境](http://localhost:5000)

#### Test
```npm test```

### Docker

#### Create docker image on local
```docker build -t thinkshake/api .```

#### Run container
```docker run --name thinkshake-api -d -itv $(pwd):/srv/thinkshake-api -p 5000:5000 thinkshake/api```

**Please make sure that your dev path is shared in Docker**

#### Login container
```docker exec -it thinkshake-api /bin/bash```

## Licence
