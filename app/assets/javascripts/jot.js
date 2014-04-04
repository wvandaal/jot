window.Jot = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Messages: {},

  // Note: All #ids must be capitalized to prevent style cross-contamination from
  // ids generated by markdown redering
  initialize: function() {
    // Retrieves bootstrapped currentUser JSON
    this.currentUser = new Jot.Models.User(
      JSON.parse($('#CURRENT-USER').html()).currentUser
    );

    new Jot.Routers.AppRouter();
  },

  renderMessages: function(msgs) {
    var view      = new Jot.Views.Messages({messages: msgs || Jot.Messages}),
        $messages = $('#MESSAGES');

    $messages.html(view.$el);
    $messages.children().delay(5000).fadeOut(1000, function() { this.remove(); });
  },

  renderNavbar: function(user) {
    var header = new Jot.Views.Header({
      model: user || Jot.currentUser 
    });

    $('#NAVBAR').html(header.$el);
  }
};

// CompositeView class for rendering subviews within a larger view
Backbone.CompositeView = Backbone.View.extend({

  // Subview stored as key-value pairs where values are arrays of views and  
  // keys are css element selectors where the views are to be rendered. 
  // I.e.: {selector: [subviews, ...]}
  // E.g.: {".container": [Jot.Views.JotsNew]}
  //
  // Note: subviews() is written as memoizing function to prevent sharing of
  // subviews property between instances (this prevents multiple-render errors)
  subviews: function() {
    if (!this._subviews) {
      this._subviews = {};
    }

    return this._subviews;
  },

  // Add a subview to the subviews object and append it to the corresponding
  // container element denoted by the given selector
  addSubview: function(selector, subview) {
    var $selectorEl       = this.$(selector),
        selectorSubviews  = 
      this.subviews()[selector] || (this.subviews()[selector] = []);

    selectorSubviews.push(subview);

    $selectorEl.append(subview.$el);
  }, 

  // Overrides the default remove method to remove all associated subviews
  remove: function () {
    Backbone.View.prototype.remove.call(this);

    // remove all subviews as well
    _(this.subviews()).each(function (subviews, selector) {
      _(subviews).each(function (subview){
        subview.remove();
      });
    });
  },

  // Removes a specific subview from the composite view given a selector and
  // an instance of a subview
  removeSubview: function (selector, subview) {
    var selectorSubviews =
          this.subviews()[selector] || (this.subviews()[selector] = []),
        subviewIndex = selectorSubviews.indexOf(subview);

    selectorSubviews.splice(subviewIndex, 1);
    subview.remove();
  },

  renderSubviews: function() {
    var compView = this,
        $selectorEl;

    // For each key-value pair, render the subviews in the given selector 
    // element ($selectorEl) denoted by the key
    _(compView.subviews()).each(function(subviews, selector) {
      $selectorEl = compView.$(selector);
      $selectorEl.empty();

      subviews.forEach(function(subview) {
        $selectorEl.append(subview.$el);
        subview.delegateEvents();
      });
    });
  }
});



/////////////////////////
// Launch Application! //
/////////////////////////
$(document).ready(function(){
  var renderer = new marked.Renderer();

  // Rewrites code method of marked renderer to allow for waypoint addition.
  // By default, any necessary waypoint will be added to the end of code block.
  renderer.code = function(code, lang, escaped, token) {
    var waypoint    = '<span id="_WAYPOINT"></span>',
        waypointInd = code.indexOf(waypoint);

    // Adds test for empty code blocks to prevent escaping of whitespace characters
    // by highlighter
    if (this.options.highlight && code.match(/\w+/)) {
      var out = this.options.highlight(code.replace(waypoint, ""), lang);
      if (out != null && out !== code) {
        token.escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (token.escaped ? code : escape(code, true))
        + (waypointInd !== -1 ? waypoint : "")
        + '\n</code></pre>';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (token.escaped ? code : escape(code, true))
      + (waypointInd !== -1 ? waypoint : "")
      + '\n</code></pre>\n';
  };

  // Unescape waypoint in codespans
  renderer.codespan = function(text) {
    var waypoint = '<span id="_WAYPOINT"></span>';
    return '<code>' + text.replace(_.escape(waypoint), waypoint) +'</code>'
  };

  // Set highlighting options for marked
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }, 
    renderer: renderer
  });

  Jot.initialize();
});
