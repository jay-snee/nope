module Subsciption
  class NotificationJob < ApplicationJob
    queue_as :default

    def perform(notification_id)
      notification = Notification.find notification_id
      notification.process_payload
    end
  end
end
