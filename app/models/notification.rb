class Notification < ApplicationRecord

  after_create :schedule_processing_job

  private

  def schedule_processing_job
    Subscription::NotificationJob.perform_later id
  end
end
