
var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    if(href.startsWith('wiki:')) {
        return `<a href="#" onclick="renderer.changePage('${href}')" title="${title}">${text}</a>`;
    }
    
    return `<a href="${href}" title="${title}">${text}</a>`;        
};

var MarkdownEditor = React.createClass({
  getInitialState: function() {    
    renderer.changePage =   function(href) {
        this.props.onChangePage(href);
        this.refs.textarea.value = this.props.pageText;
        this.handleChange();
    }.bind(this);    
    return {value: this.props.pageText};
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSave(this.state.value);  
  },
  
  handleChange: function() {    
    this.setState({value: this.refs.textarea.value});
  },
  
  toggleEdit: function(e) {  
    e.preventDefault();    
    this.setState({editing: !this.state.editing});  
  },
  rawMarkup: function() {
    try {
        return { __html: marked(this.state.value, {sanitize: true, renderer:renderer }) };
    }
    catch(e) {
        return "<b>" + e + "</b>";
    }
    
  },
  render: function() {
    var editorStyle = {},
        headerLinkStyle = {'cursor':'pointer'};
    if (!this.state.editing) {
        editorStyle.display = 'none';
    }
    
    return (
      <div>
        <h2><a onClick={this.toggleEdit} style={headerLinkStyle}>{this.props.pageTitle}</a></h2>
        <div
          className="content"
          dangerouslySetInnerHTML={this.rawMarkup()}
        />
        <div className="MarkdownEditor" style={editorStyle}>
        <h3>Input</h3>
        <textarea
          onChange={this.handleChange}
          ref="textarea"
          defaultValue={this.props.pageText} />
       
        
         <form onSubmit={this.handleSubmit}>          
          <button>Save</button>
        </form>        
        </div>
      </div>
    );
  }
});


var WikiApp = React.createClass({
    getInitialState: function() {    
        var wiki = JSON.parse(localStorage.getItem('wiki')) || {'FrontPage': 'Type some *markdown* _here_!'},
            page = 'FrontPage',
            text = wiki[page];
        return {wiki:wiki, page:page, text:text};
    },
    onSave: function(pageText) {
        this.state.wiki[this.state.page] = pageText;
        this.setState({wiki:this.state.wiki, text:pageText});
        localStorage.setItem('wiki', JSON.stringify(this.state.wiki));
    },
    onChangePage: function(href) {
        var page = href.split(':')[1],
            text = this.state.wiki[page] || 'Type some *markdown* _here_!';
        this.state.wiki[page] = text;
        this.setState({page:page, text:text, wiki:this.state.wiki});        
    },
    render: function() {
        return (
        <div>
            <MarkdownEditor  pageText={this.state.text} pageTitle={this.state.page} onSave={this.onSave} onChangePage={this.onChangePage}/>
        </div>
        );
    }
});

ReactDOM.render(  
  <WikiApp/>,
  document.getElementById('content')
);