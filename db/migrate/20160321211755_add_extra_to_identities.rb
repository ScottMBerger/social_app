class AddExtraToIdentities < ActiveRecord::Migration
  def change
    add_column :identities, :extra, :string
  end
end
