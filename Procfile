web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -C ./config/worker.yml -v
release: bundle exec rake db:migrate