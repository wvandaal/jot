class Api::UsersController < ApplicationController

  def show
    @user = User.includes(:entries).find(params[:id])
    render json: @user.as_json(include: :entries)
  end

  def create
    @user = User.new(user_params)

    if @user.save
      sign_in(@user)
      render json: @user
    else
      render json: @user.errors.fullmessages
    end
  end

  def destroy
    
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
