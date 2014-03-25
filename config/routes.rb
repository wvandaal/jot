Jot::Application.routes.draw do
  root to: "site#home"

  namespace :api do
    resources :users, only: [:show, :create, :destroy] do
      resources :jots, only: [:index], controller: 'entries'
    end

    resources :jots, controller: 'entries', only: [:show, :update, :destroy, :create] do 
      member do
        get 'download'
      end
    end
    resource :session, only: [:create, :destroy, :show]
  end
end
