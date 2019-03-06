class AddTrialFieldsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :trial, :boolean
    add_column :users, :trial_started, :datetime
  end
end
