class Message < ApplicationRecord
  belongs_to :profile
  belongs_to :user

  has_many_attached :files

  def update_read_count
    self.read_status = true
    self.open_count += 1
    save
  end
end
