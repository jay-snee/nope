class ApplicationCable::ProfilesChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    logger.info 'subscribed'

    logger.info(params)
    logger.info("ID: #{params[:id]}")

    profile = current_user.profiles.find params[:id]

    stream_for profile
  end
end