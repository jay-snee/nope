class ApplicationController < ActionController::Base

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  before_action :log_request, unless: :devise_controller?
  after_action :log_response, unless: :devise_controller?

  after_action :set_user_last_seen

  BANNED_PARAMS = ["email", "password", "password_confirmation"]

  def log_request
    return false unless Rails.env.production?

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

    if request_params['user'].kind_of? Hash
      request_params['user'].except!('password')
    end

    data = {
      headers: headers,
      params: request_params
    }

    unless current_user.nil?
      data[:user] = current_user.email 

      if current_user.last_seen == nil
        current_user.update(last_seen: DateTime.now)
      elsif current_user.last_seen < (DateTime.now-15.minutes)
        current_user.update(last_seen: DateTime.now)
      end
    end

    log_data(data, 'request')
  end

  def log_response
    return false unless Rails.env.production?
    response_data = {
      status: response.code,
      message: response.message
    }

    response_data[:user] = current_user.email unless current_user.nil?
    
    log_data(response_data, 'response')
  end

  private

  def log_data(data, request_type)
    begin
      return true if Rails.env.test?

      client = Elasticsearch::Client.new url: ENV['ELASTICSEARCH_CLUSTER_URL'], log: true
      
      data[:request_time] = DateTime.now.iso8601
      
      if data.has_key? 'ip'
        index_response = client.index(
          index: "data-#{request_type}-#{Date.current.to_s}",
          body: data,
          pipeline: 'geoip',
          type: request_type
        )
      else
        index_response = client.index(
          index: "data-#{request_type}-#{Date.current.to_s}",
          body: data,
          type: request_type
        )
      end
    rescue Faraday::ConnectionFailed
      puts "[ERROR][ELASTIC] FARADAY CONNECTION FAILED"
      return false
    end
  end

  def verify_admin
    redirect_to root_path unless current_user.admin
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:marketing_consent, :terms_consent])
  end

  def unfiltered_params
    params.permit!.to_unsafe_h
  end

  def set_user_last_seen
    return false if current_user.nil?
    return false unless Rails.env.production?
    current_user.update(last_seen: DateTime.now)
  end
end