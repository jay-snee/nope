class HomeController < ApplicationController
  def index
    if current_user
      redirect_to action: 'dashboard'
    end
  end

  def dashboard
    @profiles = current_user.profiles
    @messages = current_user.messages
  end
end
