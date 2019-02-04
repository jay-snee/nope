FactoryBot.define do
  factory :account_digest do
    user_id { 1 }
    active { false }
    requested_delivery_time { "2019-02-04 09:17:05" }
  end
end
