class AddProfileIdAndRemoveUserIdFromProfiles < ActiveRecord::Migration[5.2]
  def change
    remove_column :profiles, :user_id
    add_column :profiles, :account_id, :integer
  end
end
