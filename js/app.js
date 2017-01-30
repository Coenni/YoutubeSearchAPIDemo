import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Header extends React.Component{//showing page header bar
    render () {
        return (
            <header>
                <h1>{this.props.title}</h1>
            </header>
        );
    }
}

class YoutubeSearchDemo extends React.Component { // main content of page
 
  constructor(props) {
    super(props);
    this.state = {
        posts: [],
	     nextPageToken:null, //is used for fetching next page in paging 
       keyword:''
    };
    this.callSearch = this.callSearch.bind(this);//aliasing for scope options
    this.handleScroll = this.handleScroll.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {//scroll event listener when component mounts
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  
  callSearch(){// core function for api request
    if(this.refs.keyword.value.trim()==''){ 
      return;
    }
    var url = `https://www.googleapis.com/youtube/v3/search?maxResults=20&q=${this.refs.keyword.value}&part=snippet&key=${this.props.apikey}`;
    if(this.state.nextPageToken!=null){
        url+=`&pageToken=${this.state.nextPageToken}`;
    }
    var scope = this;
	  axios.get(url)
      .then(res => {
        var new_posts = res.data.items;
        this.setState({ posts: scope.state.posts.concat(new_posts) });//concatinating new page data to result data
		    this.setState({ nextPageToken: res.data.nextPageToken }); //keeping page token for next page
      });
  }

  handleScroll() { //for cathing bottom of page arriving moment
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.callSearch();
    }
  }

  handleChange(e) {//input text enter click control
        if (e.key === 'Enter') {
           this.setState({ posts : [] });
           this.callSearch();
        }
  }

  render() {	
      var results = this.state.posts.map(function(post, index){
          			return (<div key={ index }>
                    {index+1} 
                    <img className="thumbnailDiv" src={post.snippet.thumbnails.default.url}/>
                    <span className="infoDiv">                        
                        <b> {post.snippet.title} </b><br/>
                        <i>{post.snippet.description}</i>                   
                    </span>
                  </div>);
        			})
                  
      return (<div>
                <Header title="Youtube Search Paging Demo"/>
                <div className="container">
                    <input type="text" placeholder="type search text and press enter" ref="keyword" onKeyPress={this.handleChange}/>
                    <div> 
                        { results }
                    </div>
                </div>            
              </div>)
  }
}

ReactDOM.render(
  <YoutubeSearchDemo apikey="AIzaSyD8KBj5KHaZg5TG5TUVBPnjUmwV0HGlkvw"/>,
  document.getElementById('app')
);