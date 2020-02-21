require "rails_helper"

RSpec.describe Notification, :type => :model do
  context 'when being created' do
    it 'queues a subscription notification job' do
    	expect {
        Notification.create!
		  }.to have_enqueued_job(Subscription::NotificationJob)
    end
  end

  context "#process_payload" do
    context "with a customer.subscription.created event" do
      it "increases the user's max profile count" do
        user = FactoryBot.create(:unsubscribed_user)
        notification = FactoryBot.create(:subscription_created_notification)

        expect {
         notification.process_payload
        }.to change{
         User.last.max_profiles
        }.from(3).to(33)
      end
    end

    context "with a customer.subscription.deleted event" do
      it "decreases the user's max profile count" do
        user = FactoryBot.create(:subscribed_user)
        notification = FactoryBot.create(:subscription_deleted_notification)

        expect {
         notification.process_payload
        }.to change{
          puts User.last.max_profiles
          User.last.max_profiles
        }.from(33).to(3)
      end
    end
  end

  around do |example|
    ClimateControl.modify SUBSCRIPTION_MIN_PROFILE_COUNT: '3', SUBSCRIPTION_MAX_PROFILE_COUNT: '30' do
      example.run
    end
  end
end