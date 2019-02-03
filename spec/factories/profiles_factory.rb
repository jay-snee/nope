# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do
  factory :profile do
    sequence :email_address do |n|
      "address_#{n}@example.com"
    end
    sequence :email_display do |n|
      "display_#{n}@example.com"
    end

    factory :profile_with_message do
      before(:create) do |profile, eval|
        create(:message, profile: profile, user: profile.user)
      end
    end
  end
end