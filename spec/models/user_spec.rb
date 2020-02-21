require "rails_helper"

RSpec.describe User, :type => :model do
  context 'when being created' do
    it 'generates three profiles' do
      user = FactoryBot.create(:user)
      expect(user.profiles.size).to eq(3)
    end

    it 'queues an event notification job' do
      expect {
        FactoryBot.create(:user)
      }.to have_enqueued_job(
        Processing::EventJob
      ).with(/new user registration - \d{2}/, 'sign up', true)
    end

    it 'has a generated referral_code' do
      user = FactoryBot.create(:user)
      expect(user.referral_code).to match(/^[a-z]{8}$/)
    end
  end

  context '#block_our_domain' do
    it 'blocks registrations using fcml.mx accounts' do
      ClimateControl.modify SEND_EMAIL_DOMAIN: 'fcml.mx' do
        expect {
          FactoryBot.create(:user, email: 'blocked@fcml.mx')
        }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    it 'allows registrations from other domains' do
      ClimateControl.modify SEND_EMAIL_DOMAIN: 'fcml.mx' do
        expect {
          FactoryBot.create(:user, email: 'blocked@example.com')
        }.not_to raise_error
      end
    end
  end
end