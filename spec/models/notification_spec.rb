require "rails_helper"

RSpec.describe Notification, :type => :model do
  context 'when being created' do
    it 'queues a subscription notification job' do
    	expect {
  			Notification.create!
		}.to have_enqueued_job(Subscription::NotificationJob)
	end
  end
end