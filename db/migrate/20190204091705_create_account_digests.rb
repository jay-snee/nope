class CreateAccountDigests < ActiveRecord::Migration[5.2]
  def change
    create_table :account_digests do |t|
      t.integer :user_id
      t.boolean :active
      t.time :requested_delivery_time

      t.timestamps
    end
  end
end
