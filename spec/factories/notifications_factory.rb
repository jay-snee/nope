# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do
  factory :subscription_created_notification, class: Notification do
    payload {
      {
        type: "customer.subscription.created",
        stripe: {
          data: {
            object: {
              customer: 1234567
            }
          }
        }
      }.to_json
    }
  end

  factory :subscription_deleted_notification, class: Notification do
    payload {
      {
        type: "customer.subscription.deleted",
        stripe: {
          data: {
            object: {
              customer: 1234567
            }
          }
        }
      }.to_json
    }
  end
end