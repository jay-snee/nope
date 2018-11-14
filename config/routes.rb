Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users

  namespace :api do
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

  root to: "home#index"

end
