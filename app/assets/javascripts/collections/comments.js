Jot.Collections.Comments = Backbone.Collection.extend({
  model: Jot.Models.Comment,

  url: function () {
    return this.jot.url() + '/comments';
  },

  initialize: function(model, options) {
    this.jot = options.jot;
  },

  commentsByParent: function() {
    var commentsHash = {},
        key;

    this.models.forEach(function(c) {
      key = c.get('parent_comment_id');
      commentsHash[key] = commentsHash[key] || [];
      commentsHash[key].push(c);
    });

    return commentsHash;
  }

});