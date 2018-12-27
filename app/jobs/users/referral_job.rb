class Users::ReferralJob < ApplicationJob

  queue_as :default

  def perform(user_id, referrer_code)
  	
  end

end