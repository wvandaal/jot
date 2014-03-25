class User < ActiveRecord::Base
  attr_reader :password, :password_confirmation

  has_many :entries

  validates :username, presence: true
  validates :password_digest, presence: {message: "Password can't be blank"}
  validates :password, length: {minimum: 6, allow_nil: true}, confirmation: true
  validates :password_confirmation, presence: {:if => :password}
  validates :email, uniqueness: true, allow_nil: true, allow_blank: true
  validates :username, uniqueness: true
  validates :session_token, presence: true

  after_initialize :ensure_session_token

  # Overide as_json method to prevend exposing session_token and password
  def as_json(options={})
    options[:except] ||= [:password_digest, :email]
    json = super
    json["gravatar_id"] = Digest::MD5::hexdigest(self.email)
    json
  end

  def to_json(options={})
    options[:except] ||= [:password_digest, :email]
    super(methods: :gravatar_id)
  end

  def gravatar_id
    Digest::MD5::hexdigest(self.email)
  end

  def self.find_by_credentials(username, pwd)
    user = User.find_by_username(username)
    return nil if user.nil?
    user.is_password?(pwd) ? user : nil
  end

  def password=(pwd)
    @password = pwd
    self.password_digest = BCrypt::Password.create(pwd)
  end

  def is_password?(pwd)
    BCrypt::Password.new(self.password_digest).is_password?(pwd)
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16);
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end

end
