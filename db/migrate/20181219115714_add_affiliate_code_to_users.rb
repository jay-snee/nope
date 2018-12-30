class AddAffiliateCodeToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :referral_code, :string, default: ''
  end
end
