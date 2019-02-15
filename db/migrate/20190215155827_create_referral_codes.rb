class CreateReferralCodes < ActiveRecord::Migration[5.2]
  def change
    create_table :referral_codes do |t|
      t.integer :user_id
      t.string :code, default: ''
      t.integer :uses
      t.boolean :active

      t.timestamps
    end
  end
end
