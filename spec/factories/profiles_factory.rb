# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do
  factory :profile do
    user

    sequence :email_address do |n|
      "address_#{n}@example.com"
    end
    sequence :email_display do |n|
      "display_#{n}@example.com"
    end

    factory :profile_with_message do
      before(:create) do |profile, _eval|
        create(:message, profile: profile, user: profile.user)
      end
    end

    factory :profile_with_multiple_messages do
      before(:create) do |profile, _eval|
        2.times do
          create(:message_with_sender_four, profile: profile, user: profile.user)
        end

        3.times do
          create(:message, profile: profile, user: profile.user)
        end

        4.times do
          create(:message_with_sender_two, profile: profile, user: profile.user)
        end

        5.times do
          create(:message_with_sender_three, profile: profile, user: profile.user)
        end
      end
    end
  end
end