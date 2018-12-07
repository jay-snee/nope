class AddConsentFieldsToUsers < ActiveRecord::Migration[5.2]
  def change
  	add_column :users, :marketing_consent, :boolean, default: false
  	add_column :users, :terms_consent, :boolean, default: false
  end
end
