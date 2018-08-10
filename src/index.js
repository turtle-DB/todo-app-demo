import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import '@fortawesome/fontawesome-free/js/all.js';

import './styles/index.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.getMeta = this.getMeta.bind(this)
    this.toggleItem = this.toggleItem.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.setItemHeight = this.setItemHeight.bind(this)
    this.getItemCountText = this.getItemCountText.bind(this)
    this.state = {
      item: {
        height: 60
      },
      items: [
        { id: 1, name: 'Go to the store', isCompleted: false, height: 0 },
        { id: 2, name: 'Walk the dog', isCompleted: false, height: 0 },
        { id: 3, name: 'Hit the gym', isCompleted: false, height: 0 }
      ]
    }
  }
  componentDidMount() {
    setTimeout(() => this.toggleItem(1), 700)
  }
  getMeta() {
    const { items } = this.state,
      completed = items.filter(item => item.isCompleted),
      uncompleted = items.filter(item => !item.isCompleted)

    return {
      completed: {
        items: completed,
        height: completed.length > 0 ? _.sumBy(completed, 'height') : 0
      },
      uncompleted: {
        items: uncompleted,
        height: uncompleted.length > 0 ? _.sumBy(uncompleted, 'height') : 0
      }
    }
  }
  toggleItem(id) {
    const updatedItems = this.state.items
      .map(item => ({ ...item, isCompleted: item.id === id ? !item.isCompleted : item.isCompleted }))
    this.setState({ items: updatedItems })
  }
  addItem(name) {
    let updatedItems = [...this.state.items]
    updatedItems.push({ id: 0, name, isCompleted: false })
    updatedItems = updatedItems.map((item, index) => {
      const newItem = { ...item, id: index + 1 }
      return newItem
    })
    this.setState({ items: updatedItems })
  }
  editItem(id, name) {
    const updatedItems = this.state.items
      .map(item => ({ ...item, name: item.id === id ? name : item.name }))
    this.setState({ items: updatedItems })
  }
  deleteItem(id) {
    let updatedItems = [...this.state.items].filter(item => item.id !== id)
    this.setState({ items: updatedItems })
  }
  setItemHeight(id, height) {
    const updatedItems = this.state.items
      .map(item => {
        if (item.id === id) {
          item.height = height
        }
        return item
      })
    this.setState({ items: updatedItems })
  }
  getItemCountText() {
    const meta = this.getMeta()
    let itemCountText = ''
    if (meta.completed.items.length === 0) {
      itemCountText = 'No completed items'
    }
    else if (meta.completed.items.length >= 1) {
      const pluralText = meta.completed.items.length === 1 ? 'item' : 'items'
      itemCountText = `${meta.completed.items.length} completed ${pluralText}`
    }
    return itemCountText
  }
  render() {
    const meta = this.getMeta()

    let uInd = 0, cInd = 0

    const items = this.state.items
      .map((item, index) => (
        <Item
          key={item.id}
          id={item.id}
          index={item.isCompleted ? cInd++ : uInd++}
          height={item.height}
          name={item.name}
          meta={meta}
          isCompleted={item.isCompleted}
          toggleItem={() => this.toggleItem(item.id)}
          editItem={this.editItem}
          deleteItem={() => this.deleteItem(item.id)}
          setItemHeight={this.setItemHeight}
        />
      ))

    const itemCountText = this.getItemCountText()

    return (
      <div id="app">
        <div id="items-outer-container">
          <div id="items-container" className="scroll-bar">
            <AddItemInput addItem={this.addItem} />
            <div id="items">
              <div
                id="items-uncompleted__spacer"
                style={{ height: `${meta.uncompleted.height}px` }}
              />
              {items}
              <div id="items-completed__header">
                <h1>{itemCountText}</h1>
              </div>
              <div
                id="items-completed__spacer"
                style={{ height: `${meta.completed.height}px` }}
              />
            </div>
          </div>
        </div>
        <div id="app__background-accent" />
        <div id="hints">
          <div id="hint-title">
            <h1>Hints</h1>
          </div>
          <div className="hint">
            <i className="fas fa-arrow-right" />
            <h1>Hit enter to add new todo</h1>
          </div>
          <div className="hint">
            <i className="fas fa-arrow-right" />
            <h1>Double click todo text to edit</h1>
          </div>
        </div>
      </div>
    )
  }
}

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
    this.props.setItemHeight(this.props.id, height)
  }
  componentDidUpdate() {
    const height = this.refs.item.getBoundingClientRect().height
    if (height !== this.props.height) {
      console.log(height, this.props.height)
      this.props.setItemHeight(this.props.id, height)
    }
  }
  getTop() {
    const { meta, id, index, height, isCompleted } = this.props

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
    const { name, id, height, index, isCompleted, toggleItem, deleteItem, editItem } = this.props
    const { isEditing } = this.state
    let classes = isCompleted ? "item completed" : "item",
      top = this.getTop()

    classes = isEditing ? `${classes} editing` : classes

    const itemName = isEditing ? (
      <ItemNameInput
        id={id}
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
        id={`item-${id}`}
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
      this.props.editItem(this.props.id, value)
    }
  }
  toggleEdit(e) {
    const { value } = e.target
    this.props.toggleEdit()
    this.props.editItem(this.props.id, value)
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

ReactDOM.render(<App />, document.getElementById('root'));