class Api::CommentsController < ApplicationController

  def index
    comments = Entry.find_by_id(params[:id]).comments(include: :user).order(created_at: :desc)
    render json: comments
  end

  def create
    comment = current_user.comments.build(comment_params)
    if comment.save
      render json: comment
    else
      render json: {errors: comment.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    comment = current_user.comments.find_by_id(params[:id])
    if !comment.nil?
      comment.destroy
      render json: {msgs: ["Comment successfully destroyed"]}
    else
      render json: {errors: ["This comment does not exist or cannot be deleted."]}, 
        status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :parent_comment_id, :entry_id)
  end
end
