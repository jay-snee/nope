class RegistrationsController < Devise::RegistrationsController
  
  protected

  def after_inactive_sign_up_path_for(resource)
    logger.info 'firing inactive sign up path'
    new_user_session_path # Or :prefix_to_your_route
  end
end