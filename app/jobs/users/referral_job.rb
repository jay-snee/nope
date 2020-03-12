module Users
  class ReferralJob < ApplicationJob
    queue_as :default

    def perform(user_id, referrer_code)
      return if referrer_code.empty?

      used_code = use_code(referrer_code)
      user = User.find user_id
      return unless used_code.user

      max_profile_count = max_profile_count(user)
      ref_profile_count = max_profile_count(used_code.user, false)

      user.update(
        referred_by_id: referrer.id,
        max_profiles: max_profile_count,
        trial: true,
        trial_started: DateTime.now
      )

      referrer.update(
        max_profiles: ref_profile_count
      )
    end

    def use_code(original_code)
      processed_code = original_code.downcase.delete(' ')
      code = ReferralCode.where(code: processed_code).first
      ReferralCode.increment_counter(:uses, code.id, touch: true)
      code
    end

    def max_profile_count(user, referred = true)
      max_profile_count = user.max_profiles
      max_profile_count += ENV['REFERRER_REWARD'].to_i if referred
      max_profile_count + ENV['SUBSCRIPTION_MAX_PROFILE_COUNT'].to_i
    end
  end
end
