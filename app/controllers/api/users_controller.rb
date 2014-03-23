class Api::UsersController < ApplicationController
  before_action :require_signed_in!, :only => [:destroy]
  before_action :require_signed_out!, :only => [:create]

  def show
    @user = User.find(params[:id])
    render json: @user.as_json
  end

  def create
    @user = User.new(user_params)

    if @user.save
      sign_in(@user)
      render json: @user
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find(params[:id])
    if user
      user.destroy
      render json: "Your account has been deleted."
    else
      render json: "This account does not exist or cannot be deleted.", status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
