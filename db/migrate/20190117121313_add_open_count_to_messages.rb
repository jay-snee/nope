class AddOpenCountToMessages < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :open_count, :integer, default: 0
  end
end
