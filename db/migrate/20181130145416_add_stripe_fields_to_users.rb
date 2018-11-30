class AddStripeFieldsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :stripe_customer_id, :string
    add_column :users, :stripe_subscription_id, :string

  end
end
