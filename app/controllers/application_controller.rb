class ApplicationController < ActionController::Base

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  after_action :set_user_last_seen

  BANNED_PARAMS = ["email", "password", "password_confirmation"]

  private

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:marketing_consent, :terms_consent])
  end

  def unfiltered_params
    params.permit!.to_unsafe_h
  end

  def set_user_last_seen
    return false if current_user.nil?
    return false unless Rails.env.production?
    current_user.update(last_seen: DateTime.now)
  end
end