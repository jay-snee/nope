class ChargesController < ApplicationController
  def new; end

  def create
    # Amount in cents
    customer = Stripe::Customer.create(
      email: params[:stripeEmail],
      source: params[:stripeToken]
    )
    subscription = Stripe::Subscription.create(
      {
        customer: customer.id,
        items: [{
          plan: ENV['STRIPE_BETA_PLAN']
        }]
      }
    )

    current_user.update(
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id
    )

    flash[:notice] = 'Thank you! We\'ll updgrade your subscription shortly'
    Processing::EventJob.perform_later(
      "subscription created - #{params[:stripeEmail]}",
      'subscription',
      false
    )
    redirect_to root_path
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end

  def destroy
    if params[:id] == current_user.stripe_subscription_id
      current_user.cancel_stripe_subscription
      flash[:notice] = 'Subscription cancelled, sorry to see you go!'
    else
      flash[:notice] = 'Unable to cancel that subscription!'
    end
    redirect_to root_path
  end
end
