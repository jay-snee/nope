class TidyUpProfileFields < ActiveRecord::Migration[5.2]
  def change
    add_column :profiles, :user_id, :integer, default: false
    remove_column :profiles, :account_id
  end
end
