import React from 'react';

class AddItemInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }
  handleKeyDown(e) {
    const { value } = e.target
    if (value && e.key === 'Enter') {
      this.props.addItem(value)
      this.refs.addItemInput.value = ''
    }
  }
  render() {
    const { handleKeyDown } = this.props
    return (
      <div id="add-item-input">
        <i className="fas fa-plus" />
        <input
          ref="addItemInput"
          type="text"
          placeholder="Add item"
          onKeyDown={this.handleKeyDown}
        />
      </div>
    )
  }
}

export default AddItemInput;
