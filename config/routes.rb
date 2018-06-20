Rails.application.routes.draw do
  get 'messages_controller/index'
  get 'messages_controller/show'
  get 'profiles/create'
  get 'profiles/show'
  devise_for :users
  get 'home/index'
  get 'home/dashboard'

  resources :profiles
  resources :messages
  
  namespace :api do
    post 'data/inbound'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: "home#index"
end
