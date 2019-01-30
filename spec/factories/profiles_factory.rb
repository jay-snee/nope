# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do
  factory :profile do
    email_address { "onetwothree@example.com" }
    email_display { "OneTwoThree@example.com" }
  end
end