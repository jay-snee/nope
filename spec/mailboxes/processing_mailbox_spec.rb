require 'rails_helper'

RSpec.describe ProcessingMailbox, type: :mailbox do
  context 'with no associated profile' do
    subject do
      receive_inbound_email_from_mail(
        from: 'from-address@example.com',
        to: 'any-old-address@example.com',
        subject: 'Subject Line',
        body: "I'm a sample body"
      )
    end

    it 'should not create a message object' do
      expect { subject }.to change(Message, :count).by(0)
    end

    it 'should bounce the message' do
      expect(subject.status).to eq('bounced')
    end
  end

  context 'with an associated profile' do
    subject do
      profile = FactoryBot.create(:profile)

      receive_inbound_email_from_mail(
        from: 'from-address@example.com',
        to: profile.email_address,
        subject: 'Subject Line',
        body: "I'm a sample body"
      )
    end

    it 'should create a message object' do
      expect { subject }.to change(Message, :count).by(1)
    end

    it 'should mark the message delivered' do
      expect(subject.status).to eq('delivered')
    end
  end
end
