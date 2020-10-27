import React, {useState} from "react";
import Header from "../components/header";
import ajax from '../ajax'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      comments: []
    }
  }
  fetchContent(){
    const params = this.props.match.params
    ajax({path: `/post/${params.postId}`})
      .then(res => {
        console.log(res)
        this.setState({
          post: res.post,
          comments: res.comments
        })
      })
  }
  componentDidMount () {
    this.fetchContent()
  }
  addComment (content) {
    console.log('addComment', content, this)
    ajax({
      method: 'POST',
      path: '/post/addComment',
      data: {
        postId: this.state.post.id,
        content,
      }
    }).then(res => this.fetchContent())

  }
  render() {
    const {post, comments} = this.state
    return (<div className="indexWrapper">
      <Header></Header>
      <div className="container">
        <div className="row section">
          <div className="col s12">
            <h4 className="postTitle">{post.title}</h4>
            <div className="post" dangerouslySetInnerHTML={{__html: post.content}}></div>
          </div>
        </div>
        <div className="row section">
          <div className="col s12">
            <div className="commentWrapper">
              <ul>
                <Form addComment={this.addComment.bind(this)}></Form>
                {comments.map(item => <CommentItem item={item} key={item.id}></CommentItem>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}
function Form ({addComment}) {
  const [content, setContent] = useState('')

  return <li className="card lighten-5">
    <div className="card-content">
      <div className="input-field">
        <textarea placeholder="内容" name="content" cols="30" rows="10" className="materialize-textarea" value={content} onChange={e => setContent(e.target.value)}></textarea>
      </div>
      <div className="input-field">
        <button className="waves-effect waves-light btn" onClick={() => addComment(content)}>发表</button>
      </div>
    </div>
  </li>
}
function CommentItem ({item}) {
  return <li className="card lighten-5">
    <div className="card-content">
      <p className="info">{`${item.username || '匿名用户'} ${new Date(item.createdAt).toISOString().replace(/T.*/,'')}`}</p>
      <p className="content" dangerouslySetInnerHTML={{__html: item.content || ''}}></p>
    </div>
  </li>
}
