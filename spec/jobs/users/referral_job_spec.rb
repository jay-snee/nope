require "rails_helper"

RSpec.describe Users::ReferralJob, :type => :job do
  describe "#perform_later" do
    it "queues the job" do
      ActiveJob::Base.queue_adapter = :test
      expect {
        Users::ReferralJob.perform_later(1, '123')
      }.to have_enqueued_job
    end
  end

  describe '#max_profile_count' do
    subject do
      ClimateControl.modify REFERRER_REWARD: '5', SUBSCRIPTION_MAX_PROFILE_COUNT: '10' do
        user = FactoryBot.create(:user)
        job = Users::ReferralJob.new
        job.max_profile_count(user)
      end
    end

    it 'should return the correct value' do
      expect(subject).to eq(18)
    end
  end

  describe '#use_code' do
    subject do
      referral_code = FactoryBot.create(:referral_code)
      job = Users::ReferralJob.new
      job.use_code(referral_code.code)
    end

    it 'should return a referral code object' do
      expect(subject.class).to eq(ReferralCode)
    end

    it "should increment the code's usage" do
      referral_code = FactoryBot.create(:referral_code)
      job = Users::ReferralJob.new
      expect { 
        job.use_code(referral_code.code)
      }.to change {
        ReferralCode.find(referral_code.id).uses
      }.by(1)
    end
  end
end