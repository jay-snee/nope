class HomeController < ApplicationController
  def index
    if current_user
      redirect_to action: 'dashboard'
    end
  end

  def privacy
  end

  def dashboard
    redirect_to action: :index if user_signed_in?
    @messages = current_user.messages
    @profiles = current_user.profiles
  end

end
