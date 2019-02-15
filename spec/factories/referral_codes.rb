FactoryBot.define do
  factory :referral_code do
    user
    code { "" }
    uses { 1 }
    active { false }
  end
end
