class Api::StripeController < ApplicationController

  def notifications
    Notification.create(payload: params.to_json)
    render status: 200
  end

end