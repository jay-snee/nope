module Processing
  class EventJob < ApplicationJob
    queue_as :default

    def perform(message, event_type, notify_slack = false)
      data = {}

      data[:request_time] = DateTime.now.iso8601
      data[:message] = message
      data[:event_type] = event_type

      send_slack_message(message, event_type) if notify_slack
    end

    private

    def send_slack_message(message, event_type)
      return true unless Rails.env.production?

      HTTParty.post(
        ENV['SLACK_WEBHOOK_URL'],
        body: {
          payload: {
            text: "#{event_type}: #{message}".gsub(/\S*@/, ' xxxxx@')
          }.to_json
        }
      )
    end

    def elastic_client
      Elasticsearch::Client.new url: ENV['ELASTICSEARCH_CLUSTER_URL'], log: true
    end
  end
end
