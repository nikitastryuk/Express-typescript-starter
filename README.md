# Express typescript starter

## Tech Stack

- Express
- TypeScript
- Mongoose
- Redis
- Jest
- Swagger
- Rest Client
- Docker
- CircleCI

## Running the project locally
In order to run the project you must have some environment variables set. It is reccomended that you add the following to your `~/.bash_profile` or equivalent, replacing the values as appropriate.

### Setup environment variables

```Shell
export DB_URL=
export DB_LOCAL_URL=
export NODE_ENV=
export PORT=
export NAME=
```

### Install Modules
Make sure `node`, `npm`
```Shell
npm install
```

## Run | Debug | Build | Test

#### Run
Make sure `redis` running

Development (watch mode):
```Shell
npm run dev
```
Production:
```Shell
npm run build
```
```Shell
npm run start
```
#### Debug
1. Open the root of the project folder (VsCode)
2. Set a break point in typescript file
3. Select `Debug Node` or `Debug Tests` from the dropdown on the debug tab
4. Click the green play button to start debugging

#### Build
Compile to js and bundle docs:
```Shell
npm run build
```

#### Test
Make sure local `mongo` running
```Shell
npm run test
```

## CI
The project is built using a continuous integration approach with `CircleCi`. All testing takes place in containers which we can define ourselves.

CI includes the following steps:
* Linting
* Testing

If any one of those steps fail then a build is considered unfit for production release.

## Deploy
In progress

## Swagger
Development (watch mode):
```Shell
npm run serve-docs
```
Bundle:
```Shell
npm run bundle-docs
```
