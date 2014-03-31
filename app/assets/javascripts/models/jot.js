Jot.Models.Jot = Backbone.Model.extend({

  urlRoot: "api/jots",

  comments: function() {
    if (!this._comments) {
      this._comments = new Jot.Collections.Comments([], {
        jot: this
      });
    }

    return this._comments;
  }

});
