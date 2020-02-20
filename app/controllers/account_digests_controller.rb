class AccountDigestsController < ApplicationController
  def create
    AccountDigest.create(
      user: current_user,
      requested_delivery_time: Time.parse("#{params[:account_digest]['requested_delivery_time(4i)']}:#{params[:account_digest]['requested_delivery_time(5i)']}"),
      active: digest_params[:active]
    )
  end

  def update
    current_user.account_digest.update(
      requested_delivery_time: Time.parse("#{params[:account_digest]['requested_delivery_time(4i)']}:#{params[:account_digest]['requested_delivery_time(5i)']}"),
      active: digest_params[:active]
    )
  end

  private

  def digest_params
    params.require(:account_digest).permit(:requested_delivery_time, :active)
  end
end
