import React from 'react';

class ItemNameInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
  }

  componentDidMount() {
    this.refs.itemNameTextArea.focus()
  }

  handleKeyDown(e) {
    const { value } = e.target
    if (value && e.key === 'Enter') {
      this.props.toggleEdit()
      this.props.editItem(this.props._id, value)
    }
  }

  toggleEdit(e) {
    const { value } = e.target
    this.props.toggleEdit()
    this.props.editItem(this.props._id, value)
  }

  render() {
    const { name, height } = this.props
    return (
      <div className="item-name-input" style={{ height: `${height - 40}px` }} >
        <textarea
          ref="itemNameTextArea"
          defaultValue={name}
          style={{ height: `${height - 40}px` }}
          onKeyDown={this.handleKeyDown}
          onBlur={this.toggleEdit}
        />
      </div>
    )
  }
}

export default ItemNameInput;
