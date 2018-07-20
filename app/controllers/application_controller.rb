class ApplicationController < ActionController::Base

  private

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

end
