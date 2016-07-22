[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-interactions-rds.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-interactions-rds)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-interactions-rds.svg)](https://david-dm.org/innowatio/iwwa-lambda-interactions-rds)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-interactions-rds/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-interactions-rds#info=devDependencies)

# Iwwa lambda interactions rds

Stores user interaction events on RDS.

## Deployment

This project deployment is automated with Lambdafile lambda-boilerplate.


## Configuration

The following environment variables are needed to configure the function:

    DB_USER
    DB_PASS
    DB_URL
    DB_NAME


## Run test

In order to run tests locally a Postgres instance and the above environment variables are needed. Then, just run npm run test command.
(A postgres DB is required)
