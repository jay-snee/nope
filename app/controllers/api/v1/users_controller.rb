class Api::V1::UsersController <  ApplicationController
  before_action :doorkeeper_authorize!

  def index
    render json: current_user.to_hash.to_json
  end 

  def me
  	render json: current_user.to_hash.to_json
  end

end