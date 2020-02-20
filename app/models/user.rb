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
  after_create :generate_default_profiles, :notify_registration

  validates :referral_code, uniqueness: true
  validate :block_our_domain

  has_many :referral_codes

  def tokens
    Doorkeeper::AccessToken.where(resource_owner_id: id).all
  end

  def generate_default_profiles
    categories = ['Profile #3', 'Profile #2', 'Profile #1']
    categories.each do |c|
      profile = profiles.create!(name: c)
      profile.generate_email
      profile.save
    end
  end

  def after_confirmation
    Processing::EventJob.perform_later(
      "new user confirmed - #{id}",
      'sign up',
      true
    )
  end

  def can_create_profile?
    return false if profiles.count >= max_profiles

    true
  end

  def stripe_subscription
    return false if stripe_subscription_id.nil?

    Stripe::Subscription.retrieve(stripe_subscription_id)
  end

  def cancel_stripe_subscription
    stripe_subscription.delete
    update(stripe_subscription_id: '')
    Processing::EventJob.perform_later(
      "subscripton cancelled - #{id}",
      'subscription',
      true
    )
  end

  def notify_registration
    Processing::EventJob.perform_later(
      "new user registration - #{id}",
      'sign up',
      true
    )
  end

  def after_database_authentication
    Processing::EventJob.perform_later("new login - #{id}", 'login', true)
  end

  def generate_referral_code
    return false unless referral_code.empty?

    code = ('a'..'z').to_a.sample(8).join
    self.referral_code = code
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
