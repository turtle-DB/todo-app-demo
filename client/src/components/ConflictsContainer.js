import React from 'react';
import onClickOutside from "react-onclickoutside";

import Conflict from './Conflict';

class ConflictsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickOutside = e => {
    this.props.clearSelectedConflict();
  };

  getConflictMeta(versions) {
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

  getAllVersions(item) {
    const otherVersions = item._conflictVersions;
    const defaultWinner = item;
    const allVersions = [defaultWinner, ...otherVersions ];

    return {
      conflicts: allVersions,
      height: _.sumBy(allVersions, 'height')
    }
  }

  render() {
    if (this.props.selectedConflict) {
      const allVersions = this.getAllVersions(this.props.selectedConflict);
      let uInd = 0, cInd = 0;

      const conflicts = allVersions.conflicts
        .map((item, index) => (
          <Conflict
            key={item._rev}
            _id={item._id}
            index={index}
            height={item.height}
            name={item.name}
            meta={allVersions}
            isCompleted={item.isCompleted}
            setItemHeight={this.props.setItemHeight}
            handlePickWinnerClick={() => this.props.handlePickWinnerClick(item)}
          />
        ))

      return (
        <div id="conflicts-outer-container">
          <div id="conflicts-container" className="scroll-bar">
            <div id="conflicts">
              <div
                id="conflicts-uncompleted__spacer"
                style={{ height: `${allVersions.height}px` }}
              />
              {conflicts}
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}


export default onClickOutside(ConflictsContainer);
