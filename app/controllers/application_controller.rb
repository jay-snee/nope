class ApplicationController < ActionController::Base

  after_action :log_tenant

  before_action :validate_tenant

  private

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

  def log_tenant
    logger.info "CURRENT TENANT: #{Apartment::Tenant.current}"
  end

  def validate_tenant
    redirect_to root_path unless Apartment::Tenant.current == current_user.account.name && !current_user.admin
  end

end
