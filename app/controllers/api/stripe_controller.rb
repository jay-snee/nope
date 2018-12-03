class Api::StripeController < ApiController

  skip_before_action :verify_authenticity_token, only: ['notifications']

  def notifications
    Notification.create(payload: params.to_json)
    render json: { status: "ok" }, status: 200
  end

end