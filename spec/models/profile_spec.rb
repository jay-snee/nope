require 'rails_helper'

RSpec.describe Profile, type: :model do
  context 'when populated with messages' do
    context '#top_senders' do
      it 'lists the top senders' do
        profile = FactoryBot.create(:profile_with_multiple_messages)
        expect(profile.top_senders).to eq([["faircustodian.com>", 14]])
      end
    end

    context '#top_senders_this_week' do
      it 'lists the top senders this week' do
        profile = FactoryBot.create(:profile_with_multiple_messages)
        expect(profile.top_senders_this_week).to eq([["faircustodian.com>", 14]])
      end
    end
  end
end