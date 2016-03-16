class UsersController < ApplicationController
  before_action :set_user, only: [:edit, :update, :destroy, :finish_signup]

  def index
    @users = User.all
    render json: @users
  end
  
  def youtube
    
    render json: @list
  end
  # GET /users/:id.:format
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

  # GET /users/:id/edit
  def edit
    # authorize! :update, @user
  end

  # PATCH/PUT /users/:id.:format
  def update
    # authorize! :update, @user
    respond_to do |format|
      if @user.update(user_params)
        sign_in(@user == current_user ? @user : current_user, :bypass => true)
        format.html { redirect_to @user, notice: 'Your profile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET/PATCH /users/:id/finish_signup
  def finish_signup
    # authorize! :update, @user 
    if request.patch? && params[:user] #&& params[:user][:email]
      @user = User.find params[:id]
      if @user.update(user_params)
        #@user.skip_reconfirmation!
        sign_in(@user, :bypass => true)
        redirect_to '/', notice: 'Your profile was successfully updated.'
      else
        @show_errors = true
      end
    end
  end
  
  def auth_complete
    # authorize! :update, @user 
    if request.patch? && params[:user] #&& params[:user][:email]
      @user = User.find params[:id]
      if @user.update(user_params)
        #@user.skip_reconfirmation!
        sign_in(@user, :bypass => true)
        render @user
      else
        @show_errors = true
      end
    end
  end
  # DELETE /users/:id.:format
  def destroy
    # authorize! :delete, @user
    @user.destroy
    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { head :no_content }
    end
  end
  
  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      accessible = [ :name, :email ] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end