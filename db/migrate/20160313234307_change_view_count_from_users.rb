class ChangeViewCountFromUsers < ActiveRecord::Migration
  def change
    change_column :users, :view_count, :integer, :null => false, :default => 0
  end
end
