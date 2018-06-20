class AddReadToMessages < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :read_status, :boolean, default: false
  end
end
