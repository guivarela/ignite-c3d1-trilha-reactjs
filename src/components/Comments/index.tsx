// eslint-disable-next-line no-use-before-define
import React from 'react';

export default class Comments extends React.Component {
  commentBox = null;

  constructor() {
    super(null);
    this.commentBox = React.createRef();
  }

  componentDidMount(): void {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    scriptEl.setAttribute('repo', 'guivarela/ignite-c3d1-trilha-reactjs');
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', 'photon-dark');
    this.commentBox.current.appendChild(scriptEl);
  }

  render(): JSX.Element {
    return (
      <div className="comment-box-wrapper container pt-7">
        <h1 className="mb-0">Comments</h1>
        <hr className="my-0" />
        <div ref={this.commentBox} className="comment-box" />
        {/* Above element is where the comments are injected */}
      </div>
    );
  }
}
