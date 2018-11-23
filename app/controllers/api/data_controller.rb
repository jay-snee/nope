class Api::DataController < ApplicationController
  
  skip_before_action :verify_authenticity_token, only: ['inbound']

  def inbound
    envelope = JSON.parse(inbound_params[:envelope])

    profile = Profile.where(email_address: envelope['to']).first

    # hard ignore for shit where we don't have an associated address 
    unless profile.nil?
      message = profile.user.messages.new(inbound_params)
      message.profile = profile
      message.raw_payload = inbound_params.to_s

      if message.save
        logger.info 'Message saved'
        ApplicationCable::ProfilesChannel.broadcast_to(profile, message)
      else
        logger.info 'Message is fucked yo'
      end
    end

    render json: { status: "ok" }, status: 200
  end

  def me
    render json: current_user.to_hash
  end

  private

  def inbound_params
    params.permit(
      :headers,
      :dkim,
      :to,
      :from,
      :html,
      :text,
      :sender_ip,
      :envelope,
      :subject,
      :charsets,
      :spf,
      :spam_score,
      :attachments,
      :'attachment-info'
    )
  end
end
