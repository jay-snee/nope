class Users::ReferralJob < ApplicationJob

  queue_as :default

  def perform(user_id, referrer_code)
  	return if referrer_code.empty?
    user = User.find user_id
  	referrer = User.where(referral_code: referrer_code).first

  	user.update(referred_by_id: referrer.id, max_profiles: (user.max_profiles + ENV["REFERRER_REWARD"].to_i))

  	referrer.update(max_profiles: (referrer.max_profiles + ENV["REFERRER_REWARD"].to_i))

  	Processing::EventJob.perform_later("Referral Processed! Code: #{referrer_code} From: #{referrer.email}", "referral", true)
  end

end
