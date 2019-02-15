require 'rails_helper'

RSpec.describe ReferralCode, type: :model do
  context 'when being created' do
    it 'generates three profiles' do
      ref_code = FactoryBot.create(:referral_code)
      expect(ref_code.code).to match(/^[a-z]{8}$/)
    end
  end
end
