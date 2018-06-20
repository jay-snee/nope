class AddProfileIdToMessages < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :profile_id, :integer
  end
end
