class ChargesController < ApplicationController

  def new
  end 
  
  def create
    # Amount in cents
    customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :source  => params[:stripeToken]
    ) 
    subscription = Stripe::Subscription.create({
      customer: customer.id,
      items: [{plan: ENV['STRIPE_BETA_PLAN']}],
    })  
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end

end
