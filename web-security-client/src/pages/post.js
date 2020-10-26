import React from "react";
import Header from "../components/header";

export default class extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.match.params)
  }
  componentDidMount () {
    // let { topicId } = useParams();
  }
  render() {
    return (<div className="indexWrapper">
      <Header></Header>
      <div className="container">
        <div className="row section">
          <div className="col s12">
            <h4 className="postTitle">{}</h4>
          </div>
        </div>
        <div className="row section">

        </div>
      </div>
    </div>)
  }
}

// export default function Post () {
//
// }
