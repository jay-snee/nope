class DigestMailer < ApplicationMailer

  default from: "digest@faircustodian.com"
  layout 'mailer'

  def digest_email
    @user = params[:user]
    mail(to: @user.email, subject: 'Fair Custodian Weekly Digest')
  end


end
