require File.join(Rails.root, "lib", "elastic_search_client.rb")

# cluster_url = 'http://elastic:changeme@127.0.0.1:9200'
# cluster_url = ENV['ELASTICSEARCH_CLUSTER_URL'] if Rails.env.production?
# 
# Elasticsearch::Model.client = Elasticsearch::Client.new url: cluster_url