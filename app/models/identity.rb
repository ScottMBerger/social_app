class Identity < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

  def self.find_for_oauth(auth)
    identity = find_or_create_by(uid: auth.uid, provider: auth.provider)
    
    if auth.provider == "google_oauth2" && identity && !identity.extra
      account = Yt::Account.new access_token: auth.credentials.token
      identity.extra = account.channel.id
      identity.save!
    elsif auth.provider == "twitter" && identity && !identity.extra
      puts auth.info.nickname
      identity.extra = auth.info.nickname
      identity.save!
    end
    
    identity
  end
end