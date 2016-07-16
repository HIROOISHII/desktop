import * as React from 'react'
import Repository from '../../models/repository'
import {Commit, LocalGitOperations, IFileStatus} from '../../lib/local-git-operations'
import CommitSummary from './commit-summary'

interface ICommitSummaryContainerProps {
  readonly repository: Repository
  readonly commit: Commit | null
  readonly selectedFile: IFileStatus | null
  readonly onSelectedFileChanged: (file: IFileStatus) => void
}

interface ICommitSummaryContainerState {
  readonly files: ReadonlyArray<IFileStatus>
}

/** A component which displays a commit's summary. */
export default class CommitSummaryContainer extends React.Component<ICommitSummaryContainerProps, ICommitSummaryContainerState> {
  public constructor(props: ICommitSummaryContainerProps) {
    super(props)

    this.state = { files: new Array<IFileStatus>() }
  }

  public componentDidMount() {
    this.reload(this.props)
  }

  public componentWillReceiveProps(nextProps: ICommitSummaryContainerProps) {
    this.reload(nextProps)
  }

  private async reload(props: ICommitSummaryContainerProps) {
    if (props.commit && this.props.commit && props.commit.sha === this.props.commit.sha) { return }

    this.setState({files: new Array<IFileStatus>()})

    if (!props.commit) { return }

    const files = await LocalGitOperations.getChangedFiles(props.repository, props.commit.sha)
    this.setState({files})
  }

  private renderCommit() {
    if (!this.props.commit) {
      return <NoCommitSelected/>
    }

    return <CommitSummary summary={this.props.commit.summary}
                          body={this.props.commit.body}
                          files={this.state.files}
                          selectedFile={this.props.selectedFile}
                          onSelectedFileChanged={file => this.props.onSelectedFileChanged(file)}/>
  }

  public render() {
    return (
      <div id='commit-summary'>
        {this.renderCommit()}
      </div>
    )
  }
}

function NoCommitSelected() {
  return <div>No commit selected</div>
}
