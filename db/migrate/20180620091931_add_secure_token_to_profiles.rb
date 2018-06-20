class AddSecureTokenToProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :profiles, :secure_token, :string
  end
end
