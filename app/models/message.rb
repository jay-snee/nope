class Message < ApplicationRecord

  belongs_to :profile
  belongs_to :user

  def parsed_html
    Nokogiri::HTML(html)
  end

end
