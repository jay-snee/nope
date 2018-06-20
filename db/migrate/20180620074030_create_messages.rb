class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.text :headers
      t.string :dkim
      t.string :to
      t.string :from
      t.text :html
      t.string :sender_ip
      t.string :envelope
      t.string :subject
      t.string :charsets
      t.string :spf

      t.timestamps
    end
  end
end
