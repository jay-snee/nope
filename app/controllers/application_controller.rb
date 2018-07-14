class ApplicationController < ActionController::Base

  after_action :log_tenant


  def log_tenant
    logger.info "CURRENT TENANT: #{Apartment::Tenant.current}"
  end

end
