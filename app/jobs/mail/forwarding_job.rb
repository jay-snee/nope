class Mail::ForwardingJob < ApplicationJob

  queue_as :default

  def perform
  end 

end