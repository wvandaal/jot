Jot.Views.CommentsShow = Backbone.CompositeView.extend({
  tagName: 'ul',
  className: 'comments',
  template: JST['comments/show'],
  attributes: {'data-parent-id': ''},

  events: {
    'click .reply': 'newComment'
  },

  initialize: function() {
    this.listenTo(this.collection, "add", this.addComment);

    this.render();
  },

  render: function() {
    var content = this.template({
      comments: this.collection.commentsByParent(),
      template: this.template,
      key: null
    });

    this.$el.html(content);
    this.renderSubviews();

    return this;
  },

  newComment: function(e) {
    // Prevents multiple new-comment forms from being rendered
    e.stopPropagation();

    var parentID  = $(e.currentTarget).data('comment-id'),
        $parentLI = this.$('li[data-id="'+ parentID + '"]'),
        data = {
          "parent_comment_id": parentID,
          "entry_id": this.model.get('id')
        },
        view, $childComments;

    // If there is already a reply form rendered for this comment, return
    if ($parentLI.find('>ul.comments>li.new-comment').length) return;

    $childComments = $parentLI.children('ul.comments');
    view = new Jot.Views.CommentsNew({
      collection: this.collection,
      data: data
    });

    // If there is no child comments ul, create one
    if (!$childComments.length) {
      $parentLI.append($('<ul class="comments" data-parent-id="' + parentID + '">'));
    }

    this.addSubview('[data-parent-id="' + parentID + '"]', view);
    $(window).scrollTop(view.$el.offset().top - $(window).height()/2);
  },

  // Adds a comment to the appropriate level of the comments list
  addComment: function(comment) {
    // pid is set to the empty string if null
    var pid           = comment.get('parent_comment_id') || "",
        $commentList  = $('[data-parent-id="' + pid + '"]'),
        commentLi     = JST['comments/partial']({
          comment: comment
        });

    $commentList.prepend(commentLi);
  }
});