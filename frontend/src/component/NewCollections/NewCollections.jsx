import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch('https://e-commerce-8j0j.onrender.com/new-collection')
    .then(res => res.json())
    .then(data => setNew_Collection(data));
  },[])

  return (
    <div className='new-collections' id="collections">  {/* Added id here */}
        <h1>New Collections</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item,i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default NewCollections