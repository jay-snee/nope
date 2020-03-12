require 'rails_helper'

RSpec.describe User, type: :model do
  context 'when being created' do
    it 'generates three profiles' do
      user = FactoryBot.create(:user)
      expect(user.profiles.size).to eq(3)
    end

    it 'has a generated referral_code' do
      user = FactoryBot.create(:user)
      expect(user.referral_code).to match(/^[a-z]{8}$/)
    end
  end

  describe '#generate_default_profiles' do
    before(:each) do
      @user = FactoryBot.create(:user)
      @user.profiles.destroy_all
    end

    subject do
      @user.generate_default_profiles
    end

    it 'should create three profiles' do
      expect(subject.size).to eq(3)
    end

    it 'should use the correct names' do
      names = ['Profile #3', 'Profile #2', 'Profile #1']
      expect(subject.collect(&:name)).to eq(names)
    end
  end

  describe '#block_our_domain' do
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
