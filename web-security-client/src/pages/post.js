import React from "react";
import Header from "../components/header";
import ajax from '../ajax'
import FilterXSS from 'xss'
import Config from  '../config'

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
        this.setState({
          post: res.post,
          comments: res.comments
        })
      })
  }
  componentDidMount () {
    this.fetchContent()
  }
  render() {
    const {post, comments} = this.state
    return (<div className="indexWrapper">
      <Header></Header>
      <div className="container">
        <div className="row section">
          <div className="col s12">
            <h4 className="postTitle">{post.title}</h4>
            <div className="post" dangerouslySetInnerHTML={{__html: FilterXSS(post.content)}}></div>
          </div>
        </div>
        <div className="row section">
          <div className="col s12">
            <div className="commentWrapper">
              <ul>
                <Form fetchContent={this.fetchContent.bind(this)} postId={post.id}></Form>
                {comments.map(item => <CommentItem item={item} key={item.id}></CommentItem>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}
class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      captcha: '',
      captchaUrl: `${Config.captchaBase}?ts=${new Date().getTime()}`
    }
  }
  changeCaptcha () {
    this.setState({
      captchaUrl: `${Config.captchaBase}?ts=${new Date().getTime()}`
    })
  }
  addComment () {
    const {content, captcha} = this.state
    if(!content.trim()) {
      return showToast('内容不能为空')
    }
    if(!captcha.trim()) {
      return showToast('验证码不能为空')
    }
    ajax({
      method: 'POST',
      path: '/post/addComment',
      data: {
        postId: this.props.postId,
        content: FilterXSS(content.trim()),
        captcha: captcha.trim()
      }
    }).then(res => {
      showToast('发表成功')
      this.setState({
        content: '',
        captcha: ''
      })
      this.changeCaptcha()
      this.props.fetchContent()
    })
      .catch(e => this.changeCaptcha())
  }
  render() {
    const {captcha, content, captchaUrl} = this.state
    return <li className="card lighten-5">
      <div className="card-content">
        <div className="input-field">
          <textarea placeholder="内容" name="content" cols="30" rows="10" className="materialize-textarea" value={content} onChange={e => this.setState({
            content: e.target.value
          })}></textarea>
        </div>
        <div className="input-field">
          <input type="text" placeholder="请输入验证码" value={captcha} onChange={e => this.setState({captcha: e.target.value})}/>
          <img src={captchaUrl} alt="验证码" onClick={() => this.changeCaptcha()}/>
        </div>
        <div className="input-field">
          <button className="waves-effect waves-light btn" onClick={() => this.addComment(content, captcha)}>发表</button>
        </div>
      </div>
    </li>
  }

}
// function Form ({addComment, captchaUrl, changeCaptcha}) {
//   const [content, setContent] = useState('')
//   const [captcha, setCaptcha] = useState('')
// }
function CommentItem ({item}) {
  return <li className="card lighten-5">
    <div className="card-content">
      <p className="info">{`${item.username || '匿名用户'} ${new Date(item.createdAt).toISOString().replace(/T.*/,'')}`}</p>
      <p className="content" dangerouslySetInnerHTML={{__html: FilterXSS(item.content) || ''}}></p>
    </div>
  </li>
}
