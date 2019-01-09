class Processing::EventJob < ApplicationJob

  queue_as :default

  def perform(message, event_type, notify_slack = false)

    data = {}

    data[:request_time] = DateTime.now.iso8601
    data[:message] = message
    data[:event_type] = event_type
      
    if Rails.env.production?
      index_response = elastic_client.index(
        index: "#{ENV['APP_DOMAIN'].gsub('.', '-')}-beta-events-#{Date.current.to_s}",
        body: data,
        type: 'event'
      )
    end

    if notify_slack
      send_slack_message(message, event_type)
    end

  end

  private

  def send_slack_message(message, event_type)
    if Rails.env.production?
      response = HTTParty.post(
        ENV['SLACK_WEBHOOK_URL'],
        body: {
          payload: {
            text: "#{event_type}: #{message}"
          }.to_json
        }
      )
    end
  end

  def elastic_client
    Elasticsearch::Client.new url: ENV['ELASTICSEARCH_CLUSTER_URL'], log: true
  end

end