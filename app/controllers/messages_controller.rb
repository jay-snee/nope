class MessagesController < ApplicationController
  def index
  end

  def show
    @message = current_user.messages.find params[:id]
    @message.update(read_status: true) unless @message.read_status == true
  end

  def message_html
    @message = current_user.messages.find params[:id]
    render layout: false
  end

  def destroy
    @message =current_user.messages.find params[:id]
    if @message.destroy
      Processing::EventJob.perform_later("message destroyed", 'lifecycle', false)
    end

    redirect_to root_path, notice: 'Message destroyed'
  end
end
