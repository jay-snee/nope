class HomeController < ApplicationController
  def index
    if current_user
      redirect_to action: 'dashboard'
    end
  end

  def dashboard
    redirect_to action: :index unless current_user
    
    if Apartment::Tenant.current == 'public'
      redirect_to "https://#{current_user.account.name}.#{ENV['APP_DOMAIN']}/home/dashboard"
    else
      @profiles = current_user.profiles
      @messages = current_user.messages
    end
  end
end
