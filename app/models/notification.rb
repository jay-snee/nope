class Notification < ApplicationRecord

  after_create :schedule_processing_job

  def process_payload
    data = JSON.parse payload
    case data['type']
    when "customer.subscription.created"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: (customer.max_profiles + ENV["SUBSCRIPTION_MAX_PROFILE_COUNT"].to_i)) unless customer.nil?
    when "customer.subscription.deleted"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: (customer.max_profiles - ENV["SUBSCRIPTION_MAX_PROFILE_COUNT"].to_i), stripe_subscription_id: '')
    end
  end

  private

  def schedule_processing_job
    Subscription::NotificationJob.perform_later id
  end
end
