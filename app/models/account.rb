class Account < ApplicationRecord

  has_many :users, dependent: :destroy
  has_many :profiles, dependent: :destroy

end
