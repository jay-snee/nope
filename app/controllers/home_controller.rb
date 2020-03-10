class HomeController < ApplicationController
  before_action :authenticate_user!, except: %i[
    index
    privacy
    free_acct
    terms
    get_started
  ]

  def index
    if current_user
      redirect_to action: 'dash'
    else
      render layout: 'front-page'
    end
  end

  def privacy; end

  def free_acct
    Processing::EventJob.perform_later 'Signup free', 'signup_pref', false
    redirect_to new_user_registration_path
  end

  def get_started
    Processing::EventJob.perform_later 'Get Started', 'signup_pref', false
    redirect_to new_user_registration_path
  end

  def terms; end

  def dash
    @messages = current_user.messages.order(created_at: :desc).last(10)
    @profiles = current_user.profiles
  end
end
