class Api::DataController < ApplicationController
  
  skip_before_action :verify_authenticity_token, only: ['inbound']

  def inbound
    envelope = inbound_params[:envelope]

    profile = Profile.where(email_address: envelope['to']).first

    # hard ignore for shit where we don't have an associated address 
    unless profile.nil?
      message = profile.user.messages.new(inbound_params)
      message.profile = profile

      if message.save
        logger.info 'Message saved'
      else
        logger.info 'Message is fucked yo'
      end

    end

    render json: { status: "ok" }, status: 200
  end



  private

  def inbound_params
    params.permit(
      :headers,
      :dkim,
      :to,
      :from,
      :html,
      :sender_ip,
      :envelope,
      :subject,
      :charsets,
      :spf
    )
  end
end
