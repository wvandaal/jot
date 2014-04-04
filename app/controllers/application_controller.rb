class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an :exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  # Expose methods to views
  helper_method :current_user, :signed_in?

  private

  def sign_in(user)
    @current_user = user
    session[:session_token] = user.reset_session_token!
  end

  def current_user
    return nil if session[:session_token].nil?
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def signed_in?
    !!current_user
  end

  def sign_out
    current_user.try(:reset_session_token!)
    session[:session_token] = nil
  end

  def require_signed_in!
    unless signed_in?
      render json: {errors: ["You must be signed in to do that."]}, status: :unauthorized 
    end
  end

  def require_signed_out!
    render json: {errors: ["You are already logged in."]} if signed_in?
  end
end
