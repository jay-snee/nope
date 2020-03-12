class HomeController < ApplicationController
  before_action :authenticate_user!, except: %i[
    index
    privacy
    free_acct
    terms
    get_started
  ]

  def index
    if current_user
      redirect_to action: 'dash'
    else
      render layout: 'front-page'
    end
  end

  def privacy; end

  def terms; end

  def dash
    @messages = current_user.messages.order(created_at: :desc).last(10)
  end
end
