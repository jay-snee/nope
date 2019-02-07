require 'nokogiri'

class Mail::CleanHTML < ApplicationJob

  queue_as :default

  def perform(message)
	message.clean
  end
end