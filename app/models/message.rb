class Message < ApplicationRecord

  belongs_to :profile
  belongs_to :user

  validates :name, presence: true, allow_blank: false

  def parsed_html
    Nokogiri::HTML(html)
  end

end
