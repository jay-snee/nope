class Api::DataController < ApplicationController
  
  skip_before_action :verify_authenticity_token, only: ['inbound']

  def inbound
    puts params.inspect
  end
end
