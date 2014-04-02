Jot.Models.User = Backbone.Model.extend({
  urlRoot: "api/users",

  // Return a collection containing the user's jots
  jots: function() {
    if (!this._jots) {
      this._jots = new Jot.Collections.Jots([], {
        user: this
      });
    }

    return this._jots;
  },

  // Returns true if the user is the currentUser
  currentUser: function() {
    return this.get('id') === Jot.currentUser.id;
  }
});
