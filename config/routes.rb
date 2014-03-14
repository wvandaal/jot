Jot::Application.routes.draw do
  root to: "site#home"

  namespace :api do
    resources :users, only: [:show, :create, :destroy] do
      resources :jots, only: [:index, :create], controller: 'entries'
    end

    resources :jots, only: [:show, :update, :destroy], controller: 'entries'
    resource :session, only: [:create, :destroy]
  end
end
