class DropObsoleteTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :gifts
    drop_table :receipts
    drop_table :retailers
    drop_table :qualifications
  end
end
