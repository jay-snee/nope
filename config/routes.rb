require 'sidekiq/web'

Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, controllers: { registrations: "registrations" }

  namespace :api do
    post 'stripe/notifications'
    post 'data/inbound'
    namespace :v1 do
      resources :users
    end
  end

  resources :profiles do
    member do
      post :toggle_forwarding
      post :toggle_processing
    end
  end

  resources :messages

  resources :accounts
  resources :users

  get '/me', to: 'api/v1/credentials#me'
  get 'home/index'
  get 'home/dashboard'
  get '/privacy', to: 'home#privacy'

  resources :charges

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end

  match "/404", :to => "errors#not_found", :via => :all
  match "/500", :to => "errors#internal_server_error", :via => :all

  root to: "home#index"

end
