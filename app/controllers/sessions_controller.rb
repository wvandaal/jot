class SessionsController < ApplicationController


  def create
    user = User.find_by_credentials(
      params[:user][:username], 
      params[:user][:password])
    
    if user.nil?
      render json: "The username/password entered do no match our records"
    else
      render json: "Welcome back #{user.username}!"
    end
  end
end
