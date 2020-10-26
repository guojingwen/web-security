import React from "react";
import Header from "../components/header";


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      commits: []
    };
  }
  componentDidMount() {
    fetch('http://localhost:8080/api/index', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          posts: data.posts,
          commits: data.commits
        })
      })
      .catch(function(err){
      console.log("Fetch错误:"+err);
    })
  }
  render() {
    const {posts} = this.state
    return (<div className="indexWrapper">
      <Header></Header>
      <div className="container">
        <div className="row section indexBody">
          <div className="col s8">
            {posts.length && (
              <a href={`/post/${posts[0].id}`}>
                <img className="responsive-img cover" src={posts[0].imgUrl} alt=""/>
              </a>
            )}
            <ul className="section">
              {posts.map((item, index) => (<li className="postWrapper" key={index}>
                <div className="row">
                  <div className="col s4">
                    <img className="responsive-img" src={item.imgUrl} alt=""/>
                  </div>
                  <div className="col s8">
                    <h5>
                      <a href={`/post/${item.id}`}>{item.title}</a>
                    </h5>
                    <div className="info">
                      <span>搞笑新闻</span>
                      <span>{item.commentCount}评论</span>
                      <span>{new Date(item.createdAt).toISOString().replace(/T.*/,'')}</span>
                    </div>
                  </div>
                </div>
              </li>))}
            </ul>
          </div>
          <div className="col s4">
            <h5 className="commentTitle">最新评论</h5>
          </div>
        </div>
      </div>
    </div>)
  }
}
