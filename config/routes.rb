Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
   devise_for :users, controllers: {
      sessions: 'users/sessions'
    }
  resources :users, :only => [:show, :index], param: :username
  root 'application#index'
  get '*path' => 'application#index'
end
