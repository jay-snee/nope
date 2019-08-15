class ErrorsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!

  def not_found
    render(status: 404)
  end

  def internal_server_error
    render(status: 500)
  end

  private

  def unfiltered_params
    params.permit!.to_unsafe_h
  end
end