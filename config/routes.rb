Jot::Application.routes.draw do
  root to: "site#home"

  namespace :api do
    resources :users, only: [:show, :create, :destroy, :index] do
      resources :jots, only: [:index], controller: 'entries'
    end

    resources :jots, controller: 'entries', only: [:show, :update, :destroy, :create] do 
      member do
        resources :comments, only: [:index]
        get 'download'
      end
    end
    resources :comments, only: [:destroy, :create]
    resource :session, only: [:create, :destroy, :show]
  end
end
