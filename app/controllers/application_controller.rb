class ApplicationController < ActionController::Base

  after_action :log_tenant

  #before_action :validate_tenant

  private

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

  def log_tenant
    logger.info "CURRENT TENANT: #{Apartment::Tenant.current}"
  end

  def after_sign_in_path_for(user_or_scope)
    if Rails.env.development? || Rails.env.test?
      "http://#{current_user.account.name}.localhost:#{request.port}"
    else
      "https://#{current_user.account.name}.#{ENV['APP_DOMAIN']}"
    end
  end

  def after_sign_out_path_for(resource_or_scope)
    'http://www.profiler.datawrks.io'
  end



  def validate_tenant
    redirect_to root_path unless current_user && Apartment::Tenant.current == current_user.account.name && !current_user.admin
  end

end
