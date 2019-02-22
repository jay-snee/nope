require 'rails_helper'

RSpec.describe Profile, type: :model do
  context 'when populated with messages' do
    context '#top_senders' do
      it 'lists the top senders' do
        profile = FactoryBot.create(:profile_with_multiple_messages)
        expect(profile.top_senders).to eq([["Saul Gowens <saul@faircustodian.com>", 5], ["Ben Fielding <ben@faircustodian.com>", 4], ["Jake Cowton <jake@faircustodian.com>", 3]])
      end
    end

    context '#top_senders_this_week' do
      it 'lists the top senders this week' do
        profile = FactoryBot.create(:profile_with_multiple_messages)
        expect(profile.top_senders_this_week).to eq([["Saul Gowens <saul@faircustodian.com>", 5], ["Ben Fielding <ben@faircustodian.com>", 4], ["Jake Cowton <jake@faircustodian.com>", 3]])
      end
    end
  end
end