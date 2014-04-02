Jot.Views.JotsShow = Backbone.CompositeView.extend({
  className: 'container',
  template: JST['jots/show'],

  events: {
    'click .reply': 'newComment',
    'click #DOWNLOAD': 'download'
  },

  initialize: function() {
    var promise = this.collection.fetch(),
        that    = this,
        comments;

    promise.done(function() {
      comments = new Jot.Views.CommentsShow({
        model: that.model,
        collection: that.collection
      });
      that.addSubview('#JOT-COMMENTS', comments);
      that.render();
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that.render();
    });
  },

  render: function() {
    var content = this.template({
      jot: this.model
    });

    this.$el.html(content);
    this.renderSubviews();

    return this;
  },

  // Creates a new-comment form at the top-level and scrolls to it
  newComment: function(e) {
    var $commentsUL = this.$('[data-parent-id=""]'),
        data = {
          "parent_comment_id": "",
          "entry_id": this.model.get('id')
        },
        view;

    // If there is already a reply form rendered, return
    if ($commentsUL.find('>li.new-comment').length) return;

    view = new Jot.Views.CommentsNew({
      collection: this.collection,
      data: data
    });

    this.addSubview('[data-parent-id=""]', view);
    $(window).scrollTop(view.$el.offset().top - $(window).height()/2);
  },

  download: function(e) {
    var id  = this.model.get('id'),
        url = 'api/jots/' + id + '/download';
    $.fileDownload(url);
  }
});