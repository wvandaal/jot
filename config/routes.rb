Jot::Application.routes.draw do
  root to: "site#home"

  namespace :api do
    resources :users, only: [:show, :create, :destroy] do
      resources :entries, only: [:index, :create]
    end

    resources :entries, only: [:show, :update, :destroy]
    resource :session, only: [:create, :destroy]
  end
end
