class HomeController < ApplicationController
  def index
    if current_user
      redirect_to action: 'dashboard'
    end
  end

  def dashboard
    redirect_to action: :index unless current_user
    @messages = current_user.messages
    @profiles = current_user.profiles
  end
end
