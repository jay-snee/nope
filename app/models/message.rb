class Message < ApplicationRecord

  belongs_to :profile
  belongs_to :user

  def parsed_html
    page = Nokogiri::HTML(html)
  end

end
