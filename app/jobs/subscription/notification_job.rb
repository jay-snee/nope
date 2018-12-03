class Subscription::NotificationJob < ApplicationJob

  queue_as :default

  def perform(notification_id)
    notification = Notification.find notification_id
    data = JSON.parse notification.payload

    case data['type']
    
    when "customer.subscription.created"
    
    when "customer.subscription.deleted"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: ENV["SUBSCRIPTION_MIN_PROFILE_COUNT"], stripe_subscription_id: nil)
    
    when "customer.created"
    
    when "customer.updated"
    
    when "customer.source.created"
    
    when "invoice.created"
    
    when "invoice.finalized"
    
    when "invoice.payment_succeeded"
    
    when "charge.succeeded"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: ENV["SUBSCRIPTION_MAX_PROFILE_COUNT"]) unless customer.nil?
    when "charge.failed"
      customer = User.where(stripe_customer_id: data['stripe']['data']['object']['customer']).first
      customer.update(max_profiles: ENV["SUBSCRIPTION_MIN_PROFILE_COUNT"]) unless customer.nil?
    end
  end 
end