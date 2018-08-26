import React from 'react';

class Item extends React.Component {
  constructor(props) {
    super(props)
    this.getTop = this.getTop.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.state = {
      isEditing: false
    }
  }

  componentDidMount() {
    const height = this.refs.item.getBoundingClientRect().height
    this.props.setItemHeight(this.props._id, height)
  }

  getTop() {
    const { meta, _id, index, height, isCompleted } = this.props

    const prevHeight = isCompleted ?
      _.sumBy(meta.completed.items.slice(0, index), 'height') :
      _.sumBy(meta.uncompleted.items.slice(0, index), 'height'),
      top = isCompleted ?
        meta.uncompleted.height + prevHeight + 80 :
        prevHeight

    return top
  }

  toggleEdit() {
    this.setState({ isEditing: !this.state.isEditing })
  }

  render() {
    const { name, _id, height, index, isCompleted, toggleItem, deleteItem, editItem } = this.props
    const { isEditing } = this.state
    let classes = isCompleted ? "item completed" : "item",
      top = this.getTop()

    classes = isEditing ? `${classes} editing` : classes

    const itemName = isEditing ? (
      <ItemNameInput
        _id={_id}
        name={name}
        height={height}
        editItem={editItem}
        toggleEdit={this.toggleEdit}
      />
    ) : (
        <div className="item-name" onDoubleClick={!isCompleted ? this.toggleEdit : null}>
          <h1>{name}</h1>
        </div>
      )

    return (
      <div
        _id={`item-${_id}`}
        data-height={height}
        data-top={top}
        ref="item"
        className={classes}
        style={{ top: `${top}px` }}
      >
        <div className="item-icon" onClick={toggleItem}>
          <i className="far fa-circle uncompleted" />
          <i className="fas fa-check completed" />
        </div>
        {itemName}
        <div className="item-edit" onClick={this.toggleEdit}>
          <i className="fas fa-pen" />
        </div>
        <div className="item-delete" onClick={deleteItem}>
          <i className="fas fa-times-circle" />
        </div>
      </div>
    )
  }
}

export default Item;
