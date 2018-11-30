class Api::StripeController < ApplicationController

  def notification
    Notification.create(payload: params.to_json)
    return status: 200
  end

end