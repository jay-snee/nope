class MessagesChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    profile = current_user.profile.find params[:id]

    stream_for profile
  end
end