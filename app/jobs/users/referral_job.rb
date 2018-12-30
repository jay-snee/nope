class Users::ReferralJob < ApplicationJob

  queue_as :default

  def perform(user_id, referrer_code)
  	user = User.find user_id
  	referrer = User.where(referral_code: referrer_code).first

  	user.update(referred_by_id: referrer.id, max_profiles: (user.max_profiles + ENV["REFERRER_REWARD"]))

  	referrer.update(max_profiles: (referrer.max_profiles + ENV["REFERRER_REWARD"]))

  	Processing::EventJob.perform_later("referral_processed", "referral", true)
  end

end