class Profile < ApplicationRecord

  has_many :messages, -> { order(created_at: :desc) }, dependent: :destroy
  belongs_to :user
  
  before_create :generate_email

  validates :name, presence: true, allow_blank: false
  validates :email_address, uniqueness: true


  def generate_email
    address_string = "#{Faker::Science.element.capitalize}#{Faker::Space.planet.capitalize}#{Faker::Hacker.verb.capitalize}".gsub(' ', '')
    self.email_address = "#{address_string}@#{ENV['SEND_EMAIL_DOMAIN']}"
  end

end
