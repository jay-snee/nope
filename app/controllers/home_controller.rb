class HomeController < ApplicationController

  before_action :authenticate_user!, except: [:index, :privacy, :premium_acct, :free_acct]

  def index
    if current_user
      redirect_to action: 'dashboard'
    else
      render layout: 'front-page'
    end
  end

  def privacy
  end

  def free_acct
    Processing::EventJob.perform_later 'Signup free', 'signup_pref', true
    redirect_to new_user_registration_path
  end

  def premium_acct
    Processing::EventJob.perform_later 'Signup premium', 'signup_pref', true
    redirect_to new_user_registration_path
  end

  def dashboard
    @messages = current_user.messages
    @profiles = current_user.profiles
  end

end
