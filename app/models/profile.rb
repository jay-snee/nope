class Profile < ApplicationRecord

  belongs_to :user
  has_many :messages, dependent: :destroy

  
  before_create :insert_dummy_email
  after_create :generate_email

  has_secure_token :secure_token



  def generate_email
    self.email_address = "#{self.secure_token}@parse.datawrks.io".downcase
  end

  def insert_dummy_email
    self.email_address = "example@parse.datawrks.io"
  end

end
