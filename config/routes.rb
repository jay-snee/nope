require 'sidekiq/web'

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/backend', as: 'rails_admin'

  use_doorkeeper

  devise_for :users,
             controllers: {
               registrations: 'registrations', sessions: 'sessions'
             },
             path_names: {
               verify_authy: '/verify-token',
               enable_authy: '/enable-two-factor',
               verify_authy_installation: '/verify-installation',
               authy_onetouch_status: '/onetouch-status'
             }

  namespace :api do
    post 'stripe/notifications'
    post 'data/inbound'
    namespace :v1 do
      resources :users
    end
  end

  resources :account_digests

  resources :profiles do
    member do
      post :toggle_forwarding
      post :toggle_processing
    end
  end

  resources :messages do
    member do
      get :message_html
    end
  end

  resources :accounts
  resources :users

  get '/me', to: 'api/v1/credentials#me'
  get 'home/index'
  get 'home/dash'
  get '/privacy', to: 'home#privacy'
  get '/get_started', to: 'home#get_started'
  get '/terms', to: 'home#terms'


  authenticate :user, ->(u) { u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end

  root to: 'home#index'
end
