import React, { Component } from 'react';
import ItemList  from './components/ItemList';
import NewItem  from './components/NewItem';
//import logo from './logo.svg';
import { getItems } from './repositories/listStore';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state={items:getItems()};
  }
  updateItems(){
    this.setState({items:getItems()});
  }
  render() {
    const _this = this;
    return (
      <div className="App">
        <NewItem onChange={() => _this.updateItems()} />
        <ItemList items={this.state.items}/>
      </div>
    );
  }
}

export default App;
