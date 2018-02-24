import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

const data = [
  { id: 1, title: 'title1' },
  { id: 2, title: 'title2' },
  { id: 3, title: 'title3' },
]

function Repeat ({ children, list, tag, ...props }) {
  console.log(tag)
  return (
    <div {...props}>
      {list.map((item, key) => children(item, key))}
    </div>
  )
}

Repeat.propTypes = {
  children: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  tag: PropTypes.string,
}

function ListOfTenThings () {
  return (
    <Repeat list={data} className={styles.list} tag="ul">
      {(item, key) => (
        <p className={styles.item} key={key}>This is item {item.title} in the list</p>
      )}
    </Repeat>
  )
}

export default ListOfTenThings
