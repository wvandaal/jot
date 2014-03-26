Jot.Models.User = Backbone.Model.extend({

  // specify a urlRoot to allow models to be accessed outside collections
  urlRoot: "api/users",


  authenticate: function(options) {
    var that = this;

    $.ajax({
      type: 'POST',
      url: 'api/session',
      dataType: 'json',
      data: {
        username: this.get('username'),
        password: this.get('password')
      }
    }).done(options.success).fail(options.fail);
  },

  jots: function() {
    if (!!!this._jots) {
      this._jots = new Jot.Collections.Jots([], {
        user: this
      });
    }

    return this._jots;
  },

  currentUser: function() {
    return this.get('id') === Jot.currentUser.id;
  }
});
