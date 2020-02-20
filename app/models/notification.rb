class Notification < ApplicationRecord
  after_create :schedule_processing_job

  def process_payload
    data = JSON.parse payload
    customer_id = data['stripe']['data']['object']['customer']
    max_profile_count = ENV['SUBSCRIPTION_MAX_PROFILE_COUNT'].to_i
    customer = User.where(stripe_customer_id: customer_id).first
    case data['type']
    when 'customer.subscription.created'
      customer&.update(
        max_profiles: (max_profile_count + customer.max_profiles)
      )
    when 'customer.subscription.deleted'
      customer.update(
        max_profiles: (max_profile_count - customer.max_profiles),
        stripe_subscription_id: ''
      )
    end
  end

  private

  def schedule_processing_job
    Subscription::NotificationJob.perform_later id
  end
end
