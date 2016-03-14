class UsersController < ApplicationController
  respond_to :json

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.where("lower(username) = ?", params[:username].downcase).first
    if @user
      User.increment_counter(:view_count, @user.id)
      if current_user && current_user.id == @user.id
        render json: @user
      else
        render json: '{"response": "You are not this user"}'
      end
    else
      render json: '{"response": "User does not exist"}'
    end
  end

end
