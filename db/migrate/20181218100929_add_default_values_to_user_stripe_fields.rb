class AddDefaultValuesToUserStripeFields < ActiveRecord::Migration[5.2]
  def change
  	change_column :users, :stripe_customer_id, :string, default: ''
	change_column :users, :stripe_subscription_id, :string, default: ''
  end
end
