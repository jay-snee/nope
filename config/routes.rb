Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users
  
  get '/me', to: 'api/v1/users#me'

  get 'home/index'
  get 'home/dashboard'

  resources :profiles do
    member do
      post :toggle_forwarding
      post :toggle_processing
    end
  end

  resources :messages
  
  namespace :api do
    post 'data/inbound'
    namespace :v1 do
      resources :users
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :accounts
  resources :users

  root to: "home#index"
end
