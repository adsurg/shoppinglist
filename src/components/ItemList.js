import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import './ItemList.css';

class ItemList extends Component {
    render() {
        return <div class="itemList">
            {this.props.items && this.props.items.map(item => <Item key={item.name} item={item} />)}
        </div>    
    }    
};

ItemList.propTypes = {
    items: PropTypes.object.isRequired,
};

export default ItemList;