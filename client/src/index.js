// https://codepen.io/TheVVaFFle/pen/PBGbyq
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/index.css';
import './styles/conflicts.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

//components
import ItemsContainer from './components/ItemsContainer';
import ConflictsContainer from './components/ConflictsContainer';

// ********** Commented code shows server calls replaced with turtledb ********** //

//import axios from 'axios';
import TurtleDB from 'turtledb';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.toggleItem = this.toggleItem.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.setItemHeight = this.setItemHeight.bind(this)
    this.syncClick = this.syncClick.bind(this);
    this.loadAllTodos = this.loadAllTodos.bind(this);
    this.state = {
      item: {
        height: 60
      },
      items: []
    }

    //this.dbUrl = 'http://localhost:3000/todos';

    //this.db = new TurtleDB('todos');
    window.turtledb = new TurtleDB('todos');
    this.db = window.turtledb;
    this.db.setRemote('http://localhost:3000');
  }

  componentDidMount() {
    this.loadAllTodos();
  }

  loadAllTodos() {
    this.db.readAll()
      .then((todos) => {
        this.setState({ items: todos });
      })
      .catch((err) => console.log('Error:', err));

    // axios.get(this.dbUrl)
    //   .then(({ data: { todos } }) => {
    //     this.setState({ items: todos });
    //   })
    //   .catch((err) => console.log('Error:', err));
  }

  addItem(name) {
    const updatedItems = [...this.state.items];

    const newItem = {
      name: name,
      height: 60,
      isCompleted: false
    };

    this.db.create(newItem)
      .then((todo) => {
        updatedItems.push(todo);
        this.setState({ items: updatedItems })
      })
      .catch((err) => console.log('Error:', err));


    // axios.post(this.dbUrl, newItem)
    //   .then(({ data: { todo } }) => {
    //     updatedItems.push(todo);
    //     this.setState({ items: updatedItems })
    //   })
    //   .catch((err) => console.log('Error:', err));
  }

  editItem(_id, name) {
    let updatedItems;
    const oldItems = this.state.items;
    const oldItem = oldItems.find(item => item._id === _id);
    const newItem = Object.assign(oldItem, { name: name });

    this.db.update(_id, newItem)
      .then((updatedTodo) => {
        updatedItems = oldItems.map(item => item._id === _id ? updatedTodo : item);
        this.setState({ items: updatedItems });
      })
      .catch((err) => console.log('Error:', err));

    // axios.put(this.dbUrl + '/' + _id, newItem)
    //   .then(({ data: { todo } }) => {
    //     updatedItems = oldItems.map(item => item._id === _id ? todo : item);
    //     this.setState({ items: updatedItems });
    //   })
    //   .catch((err) => console.log('Error:', err));
  }

  toggleItem(_id) {
    let updatedItems;
    const oldItems = this.state.items;
    const oldItem = oldItems.find(item => item._id === _id);
    const newItem = Object.assign(oldItem, { isCompleted: !oldItem.isCompleted });

    this.db.update(_id, newItem)
      .then((updatedTodo) => {
        updatedItems = oldItems.map(item => item._id === _id ? updatedTodo : item);
        this.setState({ items: updatedItems });
      })
      .catch((err) => console.log('Error:', err));

    // axios.put(this.dbUrl + '/' + _id, newItem)
    //   .then(({ data: { todo } }) => {
    //     updatedItems = oldItems.map(item => item._id === _id ? todo : item);
    //     this.setState({ items: updatedItems });
    //   })
    //   .catch((err) => console.log('Error:', err));
  }

  deleteItem(_id) {
    this.db.delete(_id)
      .then(() => {
        let updatedItems = [...this.state.items].filter(item => item._id !== _id)
        this.setState({ items: updatedItems });
      })
      .catch((err) => console.log('Error:', err));

    // axios.delete(this.dbUrl + '/' + _id)
    //   .then(({ data: { todo } }) => {
    //     let updatedItems = [...this.state.items].filter(item => item._id !== _id)
    //     this.setState({ items: updatedItems });
    //   })
    //   .catch((err) => console.log('Error:', err));
  }

  syncClick() {
    this.db.sync()
      .then(() => this.loadAllTodos());

    //this.loadAllTodos();
  }

  // ********** turtledb/server code replacement ends here ********** //

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

  handleConflictClick = (item) => {
    this.setState({ selectedConflict: item });
    // this.setState({ selectedItemVersion: null });
  }

  handlePickWinnerClick = (item) => {
    this.db.setConflictWinner(item)
      .then(() => this.clearSelectedConflict())
      .then(() => this.loadAllTodos());
  }

  clearSelectedConflict = () => {
    this.setState({ selectedConflict: null });
  }

  render() {

    return (
      <div id="app">
        <ItemsContainer
          items={this.state.items}
          addItem={this.addItem}
          editItem={this.editItem}
          toggleItem={this.toggleItem}
          deleteItem={this.deleteItem}
          setItemHeight={this.setItemHeight}
          handleConflictClick={this.handleConflictClick}
        />
        <ConflictsContainer
          selectedConflict={this.state.selectedConflict}
          setItemHeight={this.setItemHeight}
          handlePickWinnerClick={this.handlePickWinnerClick}
          clearSelectedConflict={this.clearSelectedConflict}
        />
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
        <div>
          <button
            id="sync"
            onClick={this.syncClick}
          >Sync</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
