class Profile < ApplicationRecord
  has_many :messages, -> { order(created_at: :desc) }, dependent: :destroy
  belongs_to :user

  before_create :generate_email

  validates :name, presence: true, allow_blank: false
  validates :email_address, uniqueness: true

  WORD_LIST = %w[delightful expand increase wide scarce fair custodian].freeze

  def generate_email
    address = Profile::WORD_LIST.map(&:capitalize).sample(3).join
    self.email_address = "#{address}@#{ENV['SEND_EMAIL_DOMAIN']}".downcase
    self.email_display = address
  end

  def display_email_address
    "#{email_display}@#{email_address.split('@')[1]}"
  end

  def top_senders
    senders = {}
    messages.each do |m|
      domain = m.from.split('@')[1]
      if senders[domain].nil?
        senders[domain] = 1
      else
        senders[domain] += 1
      end
    end
    senders.sort_by { |_k, v| -v }[0..2]
  end

  def top_senders_this_week
    senders = {}
    last_week = (DateTime.now.beginning_of_day - 7.days)
    messages.where('created_at > ?', last_week).each do |m|
      domain = m.from.split('@')[1]
      if senders[domain].nil?
        senders[domain] = 1
      else
        senders[domain] += 1
      end
    end
    senders.sort_by { |_k, v| -v }[0..2]
  end
end
