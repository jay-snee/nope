class ProcessingMailbox < ApplicationMailbox
  
  def process
    if profile
      message = profile.messages.create(
        to: to_address,
        from: from_address,
        subject: mail.subject, 
        user: profile.user,
        raw_payload: mail.raw_source,
        content: mail.body.to_s
      )
    else
      bounced!
    end
  end

  private

  def profile
    @profile ||= Profile.where(email_address: to_address).first
  end

  def to_address
    mail.to[0].downcase
  end

  def from_address
    mail.from[0].downcase
  end
end
