class MessagesController < ApplicationController
  def index
  end

  def show
    @message = Message.find params[:id]
  end

  def destroy
    @message = Message.find params[:id]
    @message.destroy

    redirect_to root_path, notice: 'Message destroyed'
  end
end
