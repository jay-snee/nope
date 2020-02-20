class ReferralCode < ApplicationRecord
  belongs_to :user
  before_create :generate_code

  validates :code, uniqueness: true

  private

  def generate_code
    return false unless code.empty?

    code = ('a'..'z').to_a.sample(8).join
    self.code = code
  end
end
