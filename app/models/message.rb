class Message < ApplicationRecord
  belongs_to :profile
  belongs_to :user

  has_many_attached :files

  def parsed_html
    Nokogiri::HTML(html)
  end

  def update_read_count
    self.read_status = true
    self.open_count += 1
    save
  end

  def clean
    parsed_data = Nokogiri::HTML.parse(html)

    tags = parsed_data.xpath("//a")
    tags.each do |tag|
        tag.set_attribute('target', '_blank')
      end

    update(html:parsed_data.to_html)
  end
end
