class ApplicationCable::MessagesChannel < Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    stream_for current_user
  end
end