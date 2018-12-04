class Api::DataController < ApiController
  
  skip_before_action :verify_authenticity_token, only: ['inbound']

  def inbound

    envelope = JSON.parse(inbound_params[:envelope])

    profile = Profile.where(email_address: envelope['to']).first

    # hard ignore for shit where we don't have an associated address 
    unless profile.nil?
      message = profile.user.messages.new(inbound_params.except(:spam_score, :attachments, :'attachment-info'))
      message.profile = profile

      if inbound_params[:attachments].to_i > 0
        inbound_params[:attachments].to_i.times do |i|
          message.attach(inbound_params["attachment#{i}"])
        end
      end

      message.raw_payload = inbound_params.to_s

      if message.save
        logger.info 'Message saved'
        ApplicationCable::ProfilesChannel.broadcast_to(profile, message)
      else
        logger.info 'Message'
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
      :'attachment-info',
      :attachment1,
      :attachment2,
      :attachment3,
      :attachment4,
      :attachment5
    )
  end
end
