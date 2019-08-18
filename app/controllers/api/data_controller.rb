class Api::DataController < ApiController

  skip_before_action :verify_authenticity_token, only: ['inbound']

  def inbound

    envelope = JSON.parse(inbound_params[:envelope])

    profile = Profile.where(email_address: envelope['to'][0].downcase).first

    # hard ignore for shit where we don't have an associated address
    unless profile.nil?

      message_params = inbound_params

      if inbound_params[:attachments].to_i > 0
        keys = []
        inbound_params[:attachments].to_i.times do |i|
          keys << "attachment#{i+1}".to_sym
        end

        message_params = inbound_params.except(*keys)
      end

      message = profile.user.messages.new(message_params.except(:html, :text, :spam_score, :attachments, :'attachment-info'))
      message.html = message_params[:html].encode( JSON.parse(message.charsets)['html'], 'UTF-8', invalid: :replace, undef: :replace, replace: "")
      message.text = message_params[:text].encode( JSON.parse(message.charsets)['text'], 'UTF-8', invalid: :replace, undef: :replace, replace: "")
      message.profile = profile

      if inbound_params[:attachments].to_i > 0
        inbound_params[:attachments].to_i.times do |i|
          message.files.attach(inbound_params["attachment#{i+1}"])
        end
      end

      message.raw_payload = inbound_params.to_s

      if message.save
        logger.info 'Message saved'
        ApplicationCable::MessagesChannel.broadcast_to(profile.user, message)
        Mail::CleanHTML.perform_later(message)
      else
        logger.info 'Message'
      end
    end
    Processing::EventJob.perform_later("inbound message", 'data', false)

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
