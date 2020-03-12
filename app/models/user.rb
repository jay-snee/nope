class User < ApplicationRecord
  devise :authy_authenticatable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable

  has_many :profiles, dependent: :destroy
  has_many :messages, dependent: :destroy

  has_many :access_grants, class_name: 'Doorkeeper::AccessGrant',
                           foreign_key: :resource_owner_id,
                           dependent: :delete_all

  has_many :access_tokens, class_name: 'Doorkeeper::AccessToken',
                           foreign_key: :resource_owner_id,
                           dependent: :delete_all

  has_one :account_digest, dependent: :destroy

  before_validation :generate_referral_code
  after_create :generate_default_profiles

  validates :referral_code, uniqueness: true
  validate :block_our_domain

  has_many :referral_codes

  def tokens
    Doorkeeper::AccessToken.where(resource_owner_id: id).all
  end

  def generate_default_profiles
    categories = ['Profile #3', 'Profile #2', 'Profile #1']
    categories.collect {|title| profiles.create!(name: title) }
  end

  def can_create_profile?
    profiles.count < max_profiles
  end

  def generate_referral_code
    return false unless referral_code.empty?

    self.referral_code = ('a'..'z').to_a.sample(8).join
  end

  def referred_by
    User.find referred_by_id
  rescue ActiveRecord::RecordNotFound
    nil
  end

  def referred
    User.where(referred_by_id: id).all
  end

  def block_our_domain
    if !email.include? ENV['SEND_EMAIL_DOMAIN']
      false
    else
      errors.add(:email, "can't be a local address")
    end
  end
end
