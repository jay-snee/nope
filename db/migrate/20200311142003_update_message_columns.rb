class UpdateMessageColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :messages, :headers, :text
    remove_column :messages, :dkim, :string
    remove_column :messages, :html, :text
    remove_column :messages, :sender_ip, :string
    remove_column :messages, :envelope, :string
    remove_column :messages, :charsets, :string
    remove_column :messages, :spf, :string
    remove_column :messages, :text, :text
  end
end