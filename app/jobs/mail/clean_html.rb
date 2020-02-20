require 'nokogiri'

module Mail
  class CleanHTML < ApplicationJob
    queue_as :default

    def perform(message)
      message.clean
    end
  end
end
