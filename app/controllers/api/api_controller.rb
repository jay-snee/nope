class  ApiController < ApplicationController

  skip_before_action :authenticate_user!
  skip_before_action :log_request

end
