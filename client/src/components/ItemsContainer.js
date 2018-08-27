import React from 'react';

import Item from './Item';
import AddItemInput from './AddItemInput';

class ItemsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.getItemCountText = this.getItemCountText.bind(this);
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
    return itemCountText;
  }

  getMeta() {
    const items = this.props.items;
    const completed = items.filter(item => item.isCompleted);
    const uncompleted = items.filter(item => !item.isCompleted);

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

  render() {
    const meta = this.getMeta();

    let uInd = 0, cInd = 0;

    const items = this.props.items
      .map((item, index) => (
        <Item
          key={item._id}
          _id={item._id}
          index={item.isCompleted ? cInd++ : uInd++}
          height={item.height}
          name={item.name}
          meta={meta}
          isCompleted={item.isCompleted}
          hasConflict={item._conflicts}
          conflictVersions={item._conflictVersions}
          toggleItem={() => this.props.toggleItem(item._id)}
          editItem={this.props.editItem}
          deleteItem={() => this.props.deleteItem(item._id)}
          setItemHeight={this.props.setItemHeight}
          handleConflictClick={() => this.props.handleConflictClick(item)}
        />
      ))

    const itemCountText = this.getItemCountText();

    return (
      <div id="items-outer-container">
        <div id="items-container" className="scroll-bar">
          <AddItemInput addItem={this.props.addItem} />
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
    )
  }
}


export default ItemsContainer;
