class Notification < ApplicationRecord

  after_create :schedule_processing_job

  def process_payload
    data = JSON.parse payload

    case data['type']
    
    when "customer.subscription.created"
    
    when "customer.subscription.deleted"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: ENV["SUBSCRIPTION_MIN_PROFILE_COUNT"], stripe_subscription_id: '')
    
    when "customer.created"
    
    when "customer.updated"
    
    when "customer.source.created"
    
    when "invoice.created"
    
    when "invoice.finalized"
    
    when "invoice.payment_succeeded"
    
    when "charge.succeeded"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: (customer.max_profiles + ENV["SUBSCRIPTION_MAX_PROFILE_COUNT"]) unless customer.nil?
    when "charge.failed"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: ENV["SUBSCRIPTION_MIN_PROFILE_COUNT"]) unless customer.nil?
    end
  end

  private

  def schedule_processing_job
    Subscription::NotificationJob.perform_later id
  end
end
