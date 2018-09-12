import React, { Component } from 'react';
import { addItem } from '../repositories/listStore';
import './NewItem.css';

class NewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          quantity: 0,
        }
      }
    addItem(name, quantity){
        addItem(this.state.name, this.state.quantity)
        this.props.onChange && this.props.onChange();
        this.setState({name: "", quantity: 0});
    }
    updateName(evt){
        this.setState(Object.assign({}, this.state, {name: evt.target.value}));
    }
    updateQuantity(evt){
        this.setState(Object.assign({}, this.state, {quantity: evt.target.valueAsNumber}));
    }
    render(){ 
        const _this = this;
        return <div class="newItem">
            <div class="newItem-name">
                <label for="newitem-name-field">name</label>
                <input type="text" class="newItem-name-field" name="newitem-name-field" value={this.state.name} onChange={evt => _this.updateName(evt)} />
            </div>
            <div class="newItem-quantity">
                <label for="newitem-quantity-field">quantity</label>
                <input type="number" class="newItem-quantity-field" name="newitem-quantity-field" value={this.state.quantity} onChange={evt => _this.updateQuantity(evt)} />
            </div>
            <div class="newItem-actions">
                <button onClick={() => _this.addItem()}>add</button>
            </div>
        </div>
    }     
};

export default NewItem;