class HomeController < ApplicationController
  
  before_action :authenticate_user!, except: [:index, :privacy]

  def index
    if current_user
      redirect_to action: 'dashboard'
    else
      render layout: 'front-page'
    end
  end

  def privacy
  end

  def dashboard
    @messages = current_user.messages
    @profiles = current_user.profiles
  end

end
