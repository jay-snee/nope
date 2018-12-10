require 'multi_json'
require 'typhoeus/adapters/faraday'
require 'elasticsearch/api'

class ElasticSearchClient
  include Elasticsearch::API

  # Use local ES cluster for Dev/Test environments
  cluster_url = 'http://elastic:changeme@127.0.0.1:9200'
  cluster_url = ENV['ELASTICSEARCH_CLUSTER_URL'] if Rails.env.production?

  CONNECTION = ::Faraday::Connection.new url: cluster_url

  def perform_request(method, path, params, body)
    puts "--> #{method.upcase} #{path} #{params} #{body}"

    unless params[:scroll].nil?
      # append scroll params to path
      path += "?scroll=#{params[:scroll]}"
    end


    CONNECTION.run_request \
      method.downcase.to_sym,
      path,
      ( body ? MultiJson.dump(body): nil ),
      {'Content-Type' => 'application/json'}
  end
end