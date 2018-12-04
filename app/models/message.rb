class Message < ApplicationRecord

  belongs_to :profile
  belongs_to :user

  has_many_attached :files

  def parsed_html
    Nokogiri::HTML(html)
  end

end
