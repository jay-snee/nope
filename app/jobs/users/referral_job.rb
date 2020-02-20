module Users
  class ReferralJob < ApplicationJob
    queue_as :default

    def perform(user_id, referrer_code)
      return if referrer_code.empty?

      processed_code = referrer_code.downcase.delete(' ')
      user = User.find user_id

      ref_code = ReferralCode.where(code: processed_code).first
      ReferralCode.increment_counter(:uses, ref_code.id, touch: true)
      referrer = ref_code.user

      if ref_code.user
        max_profile_count = get_max_profile_count(user)
        ref_profile_count = referrer.max_profiles + ENV['REFERRER_REWARD'].to_i

        user.update(
          referred_by_id: referrer.id,
          max_profiles: max_profile_count,
          trial: true,
          trial_started: DateTime.now
        )
        referrer.update(max_profiles: ref_profile_count)
        Processing::EventJob.perform_later(
          "Referral Processed! Code: #{processed_code} From: #{referrer.email}",
          'referral',
          true
        )
      else
        # we didn't find a referrer and bailed.
        user = User.find user_id
        Processing::EventJob.perform_later(
          "Referral processing failed: \n#{user.email}\n#{processed_code}",
          'referral',
          true
        )
      end
    end

    def get_max_profile_count(user)
      max_profile_count = user.max_profiles
      max_profile_count += ENV['REFERRER_REWARD'].to_i
      max_profile_count += ENV['SUBSCRIPTION_MAX_PROFILE_COUNT'].to_i

      max_profile_count
    end
  end
end
