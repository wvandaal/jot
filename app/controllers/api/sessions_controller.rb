class Api::SessionsController < ApplicationController
  before_action :require_signed_out!, :only => [:create]
  before_action :require_signed_in!, :only => [:destroy]

  def show
    render json: session
  end

  def create
    user = User.find_by_credentials(
      params[:username], 
      params[:password])
    
    if user.nil?
      render json: {errors: ["The username/password entered do no match our records."]}, 
        status: :unprocessable_entity
    else
      sign_in(user)
      render json: user
    end
  end

  def destroy
    sign_out
    render json: {msgs: ["You have been successfully logged out."]}
  end
end
