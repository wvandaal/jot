Jot::Application.routes.draw do
  root to: "site#home"

  namespace :api do
    resources :users, only: [:show, :create, :destroy] do
      resources :jots, only: [:index], controller: 'entries'
    end

    resources :jots, only: [:show, :update, :destroy, :create], controller: 'entries'
    resource :session, only: [:create, :destroy]
  end
end
