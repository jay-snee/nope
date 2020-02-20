class Profile < ApplicationRecord
  has_many :messages, -> { order(created_at: :desc) }, dependent: :destroy
  belongs_to :user

  before_create :generate_email

  validates :name, presence: true, allow_blank: false
  validates :email_address, uniqueness: true

  WORD_LIST = %w[delightful expand increase wide scarce fair custodian].freeze

  def generate_email
    address_string = "#{WORD_LIST.sample.capitalize}#{WORD_LIST.sample.capitalize}#{WORD_LIST.sample.capitalize}".gsub(" ", '')
    self.email_address = "#{address_string}@#{ENV['SEND_EMAIL_DOMAIN']}".downcase
    self.email_display = address_string
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
    return senders.sort_by {|_k,v| -v }[0..2]
  end

  def top_senders_this_week
    senders = {}
    messages.where('created_at > ?', (DateTime.now.beginning_of_day - 7.days)).each do |m|
      domain = m.from.split('@')[1]
      if senders[domain].nil?
        senders[domain] = 1
      else
        senders[domain] += 1
      end
    end
    return senders.sort_by {|_k,v| -v}[0..2]
  end

end
