class Comment < ActiveRecord::Base
  belongs_to :entry, inverse_of: :comments
  belongs_to :user, inverse_of: :comments

  has_many(:child_comments,
           class_name: "Comment",
           foreign_key: :parent_comment_id,
           primary_key: :id)

  belongs_to(:parent_comment,
             class_name: "Comment",
             foreign_key: :parent_comment_id,
             primary_key: :id)

  validates :user, :content, presence: true

  def as_json(options={})
    options[:methods] ||= [:author, :author_gravatar]
    super
  end

  def to_json(options={})
    options[:methods] ||= [:author, :author_gravatar]
    super
  end

  def author
    self.user.username
  end

  def author_gravatar
    self.user.gravatar_id
  end
end
