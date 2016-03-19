Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
   devise_for :users, controllers: {
      sessions: 'users/sessions',
      omniauth_callbacks: 'omniauth_callbacks',
      registrations: 'users/registrations'
    }
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  match '/users/:id/auth_complete' => 'users#auth_complete', via: [:get, :patch], :as => :auth_complete
  resources :users, :only => [:show, :index], param: :username
  root 'application#index'
  get '*path' => 'application#index'
end
