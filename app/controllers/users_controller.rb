class UsersController < ApplicationController
  respond_to :json

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.where("lower(username) = ?", params[:username].downcase).first
    render json: @user
  end

end
