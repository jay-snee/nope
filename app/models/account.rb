class Account < ApplicationRecord

  after_create :create_tenant_database

  private

  def create_tenant_database
    Apartment::Tenant.create(self.name)
  end

end
