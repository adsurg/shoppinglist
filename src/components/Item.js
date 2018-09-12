import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Item.css';

class Item extends Component {
    render(){ 
        return <div class="item">
            <div class="item-name">{this.props.item.name}</div>
            <div class="item-quantity">{this.props.item.quantity}</div>
        </div>
    }     
};

Item.propTypes = {
    item: PropTypes.object.isRequired,
};

export default Item;