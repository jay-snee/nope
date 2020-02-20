class DigestMailer < ApplicationMailer
  default from: 'digest@example.com'
  layout 'mailer'

  def digest_email
    @user = params[:user]
    mail(to: @user.email, subject: 'Nope Weekly Digest')
  end
end
