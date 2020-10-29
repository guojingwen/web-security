import React, {PureComponent} from "react";
import Header from "../components/header";
import ajax from '../ajax'
import {Link} from 'react-router-dom'
import FilterXSS from 'xss'

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
  componentDidMount() {
    ajax({path: '/index'})
      .then(data => {
        this.setState({
          posts: data.posts,
          comments: data.comments
        })
      })
    // console.log(FilterXSS('<script>console.log(1234)</script>'))
  }

  render() {
    const {posts, comments} = this.state
    return (<div className="indexWrapper">
      <Header></Header>
      <div className="container">
        <div className="row section indexBody">
          <div className="col s8">
            {posts.length ? (
              <Link to={`/post/${posts[0].id}`}>
                <img className="responsive-img cover" src={posts[0].imgUrl} alt=""/>
              </Link>
            ): '加载中。。。'}
            <ul className="section">
              {posts.map(item => (<PostItem item={item} key={item.id}></PostItem>))}
            </ul>
          </div>
          <div className="col s4">
            <h5 className="commentTitle">最新评论</h5>
            <ul className="section commentWrapper">
              {comments.map(item => (<CommentItem item={item} key={item.id}></CommentItem>))}
            </ul>
          </div>
        </div>
      </div>
    </div>)
  }
}
class PostItem extends React.PureComponent {
  render() {
    const {item} = this.props
    return <li className="postWrapper" key={item.id}>
      <div className="row">
        <div className="col s4">
          <img className="responsive-img" src={item.imgUrl} alt=""/>
        </div>
        <div className="col s8">
          <h5>
            <Link to={`/post/${item.id}`}>{item.title}</Link>
          </h5>
          <div className="info">
            <span>搞笑新闻</span>
            <span>{item.commentCount}评论</span>
            <span>{new Date(item.createdAt).toISOString().replace(/T.*/,'')}</span>
          </div>
        </div>
      </div>
    </li>
  }
}

class CommentItem extends PureComponent {
  render() {
    const {item} = this.props
    return <li>
      <div>
        <div className="nick">{`${item.username || '匿名用户'} ${new Date(item.createdAt).toISOString().replace(/T.*/,'')}`}</div>
        <div className="commentContent" dangerouslySetInnerHTML={{__html: FilterXSS(item.content)}}></div>
        <div className="info">
          文章
          <Link to={`/post/${item.postId}`}>
            {item.postTitle}
          </Link>
        </div>
      </div>
    </li>
  }
}
