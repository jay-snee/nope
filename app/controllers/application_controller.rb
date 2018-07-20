class ApplicationController < ActionController::Base

  after_action :log_tenant

  #before_action :validate_tenant

  private

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

end
