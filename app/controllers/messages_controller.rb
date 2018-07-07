class MessagesController < ApplicationController
  def index
  end

  def show
    @message = current_user.messages.find params[:id]
  end

  def destroy
    @message =current_user.messages.find params[:id]
    @message.destroy

    redirect_to root_path, notice: 'Message destroyed'
  end
end
