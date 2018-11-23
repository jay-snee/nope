class AddRawPayloadToMessages < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :raw_payload, :text
  end
end
