class ErrorsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!

  def not_found
    header_strings = [
    	"Authorization",
    	"SCRIPT_NAME",
    	"QUERY_STRING",
    	"REQUEST_METHOD",
    	"REQUEST_PATH",
    	"REQUEST_URI",
    	"HTTP_VERSION",
    	"HTTP_HOST",
    	"HTTP_USER_AGENT",
    	"HTTP_ACCEPT_LANGUAGE",
    	"SERVER_NAME",
    	"SERVER_PORT",
    	"PATH_INFO",
    	"REMOTE_ADDR"
    ]
    headers = {}
    header_strings.each do |header_string|
      headers[header_string] = request.headers[header_string]
    end

    request_params = unfiltered_params
    BANNED_PARAMS.each do |param|
      request_params.except!(param)
    end

    data = {
      headers: headers,
      params: request_params
    }

    log_data(data, 'not-found')
    render(status: 404)
  end

  def internal_server_error
  	header_strings = [
    	"Authorization",
    	"SCRIPT_NAME",
    	"QUERY_STRING",
    	"REQUEST_METHOD",
    	"REQUEST_PATH",
    	"REQUEST_URI",
    	"HTTP_VERSION",
    	"HTTP_HOST",
    	"HTTP_USER_AGENT",
    	"HTTP_ACCEPT_LANGUAGE",
    	"SERVER_NAME",
    	"SERVER_PORT",
    	"PATH_INFO",
    	"REMOTE_ADDR"
    ]
    headers = {}
    header_strings.each do |header_string|
      headers[header_string] = request.headers[header_string]
    end

    request_params = unfiltered_params
    BANNED_PARAMS.each do |param|
      request_params.except!(param)
    end

    data = {
      headers: headers,
      params: request_params
    }

    log_data(data, 'error')

    render(status: 500)
  end

  private

  def unfiltered_params
    params.permit!.to_unsafe_h
  end
end