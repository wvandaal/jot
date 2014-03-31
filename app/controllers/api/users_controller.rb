class Api::UsersController < ApplicationController
  before_action :require_signed_in!, :only => [:destroy]
  before_action :require_signed_out!, :only => [:create]

  def show
    user = User.find_by_id(params[:id])
    if !user.nil?
      render json: user.as_json
    else
      render json: {errors: ["There is no user with an id of #{params[:id]}"]}, status: :not_found
    end
  end

  def create
    user = User.new(user_params)

    if user.save
      sign_in(user)
      render json: user
    else
      render json: {errors: user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find_by_id(params[:id])
    if !user.nil?
      user.destroy
      render json: {msgs: ["Your account has been deleted."]}
    else
      render json: {errors: ["This account does not exist or cannot be deleted."]}, 
        status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
