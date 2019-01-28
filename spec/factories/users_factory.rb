# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do

  factory :user do
    email 				  {'user@example.com'}
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
    max_profiles {3}
  end

  factory :unsubscribed_user, class: User do
    email 					{'unsubscribed_user@example.com'}
    password 				{'password'}
    password_confirmation 	{'password'}
    confirmed_at 			{Date.today}
    stripe_customer_id 		{1234567}
    stripe_subscription_id  {}
    max_profiles {3}
  end

  factory :subscribed_user, class: User do
    email           {'subscribed_user@example.com'}
    password        {'password'}
    password_confirmation   {'password'}
    confirmed_at      {Date.today}
    stripe_customer_id    {1234567}
    stripe_subscription_id  {1234567}
    max_profiles {33}
  end

  factory :admin_user, class: User do
    email 				  {'admin@example.com'}
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
    admin 				  {true}
    max_profiles {3}
  end

end