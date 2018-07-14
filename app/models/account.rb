class Account < ApplicationRecord

  after_create :create_tenant_database

  has_many :users, dependent: :destroy

  private

  def create_tenant_database
    Apartment::Tenant.create(self.name)
  end

end
