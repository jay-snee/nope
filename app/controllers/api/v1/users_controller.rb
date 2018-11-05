class Api::V1::UsersController <  ApplicationController
  before_action :doorkeeper_authorize!

  def index
    render json: current_user.to_hash
  end 

end