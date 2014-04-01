Jot.Collections.Comments = Backbone.Collection.extend({
  model: Jot.Models.Comment,

  url: function () {
    return this.jot.url() + '/comments';
  },

  initialize: function(model, options) {
    this.jot = options.jot;
  },

  // Rercursively builds an associative array of comment ids and arrays of
  // their children. If passed an id, the function will return only the 
  // subset of the array that contains that comment's descendants
  commentsByParent: function(id) {
    var hash     = {},
        comments = this.models.slice(0),
        prop;

    // Provide efault value for id param and initialize hash[id] as an empty
    // array of children 
    id = id || null;
    hash[id] = [];

    // Self-invoking step function recursively builds subtree
    (function step() {
      var keys = Object.keys(hash).map(function(k){ return parseInt(k); }), 
          i    = 0,
          c, pid, cid;

      while (i < comments.length) {
        c = comments[i];
        pid = c.get('parent_comment_id');
        cid = c.get('id');

        // If the parent_comment_id or the comment id is less than the id of the
        // root of the subtree, prune it from the comments array, otherwise
        // increment i by 1
        (pid < id || cid < id) ? comments.splice(i, 1) : i++;

        // If the parent_comment_id is part of the subtree and the comment id is
        // not, push the comment onto its parent's children array and add it as
        // a key of the hash 
        if (hash[pid] && hash[cid] === undefined) {
          hash[pid].push(c);
          hash[cid] = [];
          step();
        } 
      }
    })();

    // Remove any nodes with no children
    for (prop in hash)
      if (!hash[prop].length)
        delete hash[prop];

    return hash;
  }

});