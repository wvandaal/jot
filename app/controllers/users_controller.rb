class UsersController < ApplicationController

  def create
    @user = User.new(user_params)

    if @user.save
      self.current_user = @user
      render json: @user
    else
      render json: @user.errors.fullmessages
    end
  end

  def destroy
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end
end
