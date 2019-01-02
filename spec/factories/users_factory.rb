# https://github.com/brennovich/cheat-ruby-sheets/blob/master/factory_bot.md

FactoryBot.define do

  factory :user do
    email 				  {'user@example.com'}
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
  end

  factory :subscribed_user, class: User do
    email 					{'admin@example.com'}
    password 				{'password'}
    password_confirmation 	{'password'}
    confirmed_at 			{Date.today}
    stripe_customer_id 		{1234567}
    stripe_subscription_id  {1234567}
  end

  factory :admin_user, class: User do
    email 				  {'admin@example.com'}
    password 			  {'password'}
    password_confirmation {'password'}
    confirmed_at 		  {Date.today}
    admin 				  {true}
  end

end