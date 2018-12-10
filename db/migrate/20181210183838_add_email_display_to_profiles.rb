class AddEmailDisplayToProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :profiles, :email_display, :string
  end
end
