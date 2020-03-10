# README

## Environment Variables

In order to set environment variables on a locally running instance (assuming you have all the required gems installed) add the environment variables to the `.env` file and place it in the root folder.
Current environment variables are:

- APP_DOMAIN
- DATABASE_URL
- DISABLE_DATABASE_ENVIRONMENT_CHECK
- HOSTNAME
- REDIS_URL
- S3_ACCESS_KEY_ID
- S3_SECRET_ACCESS_KEY
- SENDGRID_DOMAIN
- SENDGRID_PASSWORD
- SENDGRID_USERNAME
- SEND_EMAIL_DOMAIN
- SLACK_WEBHOOK_URL
- STRIPE_BETA_PLAN
- STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- SUBSCRIPTION_MAX_PROFILE_COUNT
- SUBSCRIPTION_MIN_PROFILE_COUNT

- AWS_ACCESS_KEY_ID=xxxx
- AWS_SECRET_ACCESS_KEY=xxxx
- FOG_DIRECTORY=xxxx
- FOG_PROVIDER=AWS
- 
- FOG_REGION=eu-west-1
- ASSET_SYNC_GZIP_COMPRESSION=true
- ASSET_SYNC_MANIFEST=true

- REFERRER_REWARD=3

## Test Suite

To run: `bundle exec rspec -f d`

https://relishapp.com/rspec/
https://github.com/rspec/rspec-rails
https://github.com/thoughtbot/factory_bot_rails
https://github.com/thoughtbot/climate_control