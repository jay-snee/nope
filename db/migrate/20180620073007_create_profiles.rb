class CreateProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :profiles do |t|
      t.integer :user_id, null: false
      t.string :email_address, unique: true, null: false
      t.string :name, null: false, default: "New Profile"
      t.boolean :active, null: false, default: true
      t.timestamps
    end
  end
end
