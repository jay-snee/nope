class DropPlans < ActiveRecord::Migration[6.0]
  def change
    drop_table :plans
  end
end
