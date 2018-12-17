class ApplicationController < ActionController::Base

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  before_action :log_request, unless: :devise_controller?
  after_action :log_response, unless: :devise_controller?

  BANNED_PARAMS = ["email", "password", "password_confirmation"]

  ### Rescue blocks for rendering 500/404 pages
  if Rails.env.production?
    # Catch all
    rescue_from StandardError do |exception|
      response_data = {
        status: 500,
        message: exception.message,
        tenant: @current_tenant,
        backtrace: exception.backtrace[0]
      }

      response_data[:user] = current_user.email unless current_user.nil?
    
      es_log_data(response_data, 'error')

      render template: 'errors/500', status: 500, layout: 'front', locals: {exception: exception}
    end

    # 404s

    NOT_FOUND_ERRORS = [
      ActionController::RoutingError,
      ActiveRecord::RecordNotFound
    ]

    NOT_FOUND_ERRORS.each do |error|
      rescue_from error do |exception|
        response_data = {
          status: 404,
          message: exception.message,
          tenant: @current_tenant,
          backtrace: exception.backtrace[0]
        }

        response_data[:user] = current_user.email unless current_user.nil?
      
        es_log_data(response_data, 'not-found')

        render template: 'errors/404', status: 404, layout: 'front', locals: {exception: exception}
      end
    end
  end

  def log_request
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

end
