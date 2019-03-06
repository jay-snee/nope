class Users::ReferralJob < ApplicationJob

  queue_as :default

  def perform(user_id, referrer_code)
  	return if referrer_code.empty?
    begin
      processed_code = referrer_code.downcase.delete(' ')
      user = User.find user_id

      ref_code = ReferralCode.where(code: processed_code).first
      ReferralCode.increment_counter(:uses, ref_code.id, touch: true)
      referrer = ref_code.user

      user.update(
        referred_by_id: referrer.id, 
        max_profiles: (user.max_profiles + ENV["REFERRER_REWARD"].to_i + ENV["SUBSCRIPTION_MAX_PROFILE_COUNT"].to_i),
        trial: true,
        trial_started: DateTime.now
      )
      referrer.update(max_profiles: (referrer.max_profiles + ENV["REFERRER_REWARD"].to_i))
      Processing::EventJob.perform_later("Referral Processed! Code: #{processed_code} From: #{referrer.email}", "referral", true)
    rescue
      # we didn't find a referrer and bailed.
      user = User.find user_id
      Processing::EventJob.perform_later("Referral processing failed: \n#{user.email}\n#{processed_code}", "referral", true)
    end
  end

end
