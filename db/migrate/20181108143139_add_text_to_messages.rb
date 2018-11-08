class AddTextToMessages < ActiveRecord::Migration[5.2]
  def change
  	add_column :messages, :text, :text
  end
end
