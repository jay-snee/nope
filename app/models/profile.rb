class Profile < ApplicationRecord

  has_many :messages, -> { order(created_at: :desc) }, dependent: :destroy
  belongs_to :user

  before_create :generate_email

  validates :name, presence: true, allow_blank: false
  validates :email_address, uniqueness: true

  WORD_LIST = [
    'delightful',
    'expand',
    'increase',
    'join',
    'wide',
    'scarce',
    'freezing',
    'object',
    'jellyfish',
    'lip',
    'wicked',
    'bounce',
    'solid',
    'wave',
    'telling',
    'sofa',
    'unlock',
    'utter',
    'best',
    'odd',
    'nimble',
    'dashing',
    'repeat',
    'clever',
    'trace',
    'coil',
    'money',
    'fear',
    'delicious',
    'colour',
    'tame',
    'toe',
    'frequent',
    'impress',
    'smart',
    'cactus',
    'switch',
    'suffer',
    'rest',
    'deceive',
    'hollow',
    'dusty',
    'great',
    'flag',
    'fix',
    'ink',
    'tough',
    'rough',
    'carpenter',
    'tin',
    'idiotic',
    'fruit',
    'gullible',
    'order',
    'borrow',
    'government',
    'conscious',
    'bashful',
    'buzz',
    'nervous',
    'basket',
    'hop',
    'trip',
    'reaction',
    'mouth',
    'small',
    'scrape',
    'receptive',
    'edible',
    'jittery',
    'gratis',
    'pin',
    'afterthought',
    'daffy',
    'graceful',
    'dry',
    'worried',
    'hate',
    'twist',
    'sweet',
    'cumbersome',
    'wren',
    'huge',
    'placid',
    'carry',
    'notebook',
    'sleep',
    'lively',
    'zip',
    'able',
    'spell',
    'spiffy',
    'horse',
    'fantastic',
    'soap',
    'plants',
    'part',
    'please',
    'entertain',
    'driving',
    'frog',
    'horrible',
    'busy',
    'range',
    'beneficial',
    'adjustment',
    'shallow',
    'handsomely',
    'fry',
    'smiling',
    'clap',
    'separate',
    'share',
    'fancy',
    'add',
    'fancy',
    'previous',
    'marry',
    'abrupt',
    'detail',
    'border',
    'hapless',
    'quartz',
    'swift',
    'splendid',
    'elderly',
    'care',
    'rustic',
    'prepare',
    'possess',
    'alarm',
    'card',
    'excited',
    'fact',
    'arrange',
    'noiseless',
    'reason',
    'disturbed',
    'imaginary',
    'love',
    'whine',
    'route',
    'texture',
    'accurate',
    'numerous',
    'dikdik',
    'step',
    'quilt',
    'sneeze',
    'productive',
    'rapid',
    'purring',
    'sea',
    'damp',
    'birds',
    'sound',
    'umbrella',
    'resonant',
    'broken',
    'defeated',
    'title',
    'astonishing',
    'faulty',
    'adjoining',
    'save',
    'squash',
    'canvas',
    'sulky',
    'perform',
    'curve',
    'overjoyed',
    'scientific',
    'calm',
    'float',
    'ambiguous'
  ]

  def generate_email
    address_string = "#{WORD_LIST.sample.capitalize}#{WORD_LIST.sample.capitalize}#{WORD_LIST.sample.capitalize}".gsub(' ', '')
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
    return senders.sort_by {|k,v| -v}[0..2]
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
    return senders.sort_by {|k,v| -v}[0..2]
  end

end
