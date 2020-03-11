class ProcessingMailbox < ApplicationMailbox
  before_processing :require_profile
  def process
    if profile
      message = profile.messages.create(
        subject: mail.subject, 
        user: profile.user
      )
    else
      bounced!
    end
  end

  private

  def require_profile
  end

  def profile
    @profile ||= Profile.where(email_address: to_address).first
  end

  def to_address
    mail.to[0].downcase
  end
end
