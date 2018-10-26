class AddFieldsToProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :profiles, :email_forward, :boolean, default: true
    add_column :profiles, :email_process, :boolean, default: false
  end
end
