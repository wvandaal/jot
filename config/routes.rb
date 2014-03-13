Jot::Application.routes.draw do
  root to: "site#home"

  namespace :app do
    resources :user, only: [:show, :create, :destroy] do
      resources :entry, only: [:index]
    end

    resources :entry, only: [:show, :update, :destroy, :create]
  end
end
