class Api::StripeController < ApplicationController

  def notifications
    Notification.create(payload: params.to_json)
    return status: 200
  end

end