# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do

  factory :user do |user|
    sequence :email do |n|
      "user_#{n}@example.com"
    end
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
    max_profiles {3}
  end

  factory :unsubscribed_user, class: User do |user|
    sequence :email do |n|
      "unsubscribed_user_#{n}@example.com"
    end
    password 				{'password'}
    password_confirmation 	{'password'}
    confirmed_at 			{Date.today}
    stripe_customer_id 		{1234567}
    stripe_subscription_id  {}
    max_profiles {3}
  end

  factory :subscribed_user, class: User do |user|
    sequence :email do |n|
      "subscribed_user_#{n}@example.com"
    end
    password        {'password'}
    password_confirmation   {'password'}
    confirmed_at      {Date.today}
    stripe_customer_id    {1234567}
    stripe_subscription_id  {1234567}
    max_profiles {33}
  end

  factory :admin_user, class: User do |user|
    sequence :email do |n|
      "admin_user_#{n}@example.com"
    end
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
    admin 				  {true}
    max_profiles {3}
  end

end