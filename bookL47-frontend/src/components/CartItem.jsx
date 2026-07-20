import React, { useContext, useState } from 'react'
import styles from './styles/CartItem.module.css'
import { CartContext } from '../contexts/CartContext';
import CartInfo from './CartInfo'
import { formatDate, formatTime } from '../functions/formatter.js'
import TrashIcon from '../assets/trash.svg?react'
import DotsIcon from '../assets/dotsHorizontal.svg?react'



export default function CartItem({ abridged, item, active, setActive, equipment, setEquipment }) {

  const { deleteCartItem, updateCartItem, applyToAllCartItems, loading: cartLoading } = useContext(CartContext)

  
  return (
    
    <div className={styles.main}>
      {!cartLoading 
      &&
      <div className={styles.container}>
        {item.status === 'conflict' && <div className='text small error'>This booking is no longer available, please remove.</div>}
        <div className={`${styles.date} text bold regular`}>{formatDate(item.date)}</div>
        <div className={styles.bottomHalf}>
          <div>
            <div className={`${styles.time} text bold small`}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
            <div className={`${styles.room} text bold small`}>{item.location}</div>
          </div>
          <div className={styles.iconContainer}>
            { !abridged 
            && <div>
              { active !== item.id 
              && <DotsIcon className={`link`} 
              onClick={ () => 
                active === item.id 
                  ? setActive(null) 
                  : setActive(item.id)}></DotsIcon>}
              </div>
            }
            <div 
            onClick={() => deleteCartItem(item.id)}
            className={`${styles.delete} text regular`}><TrashIcon></TrashIcon>
            </div>
          </div>
        </div>
        { active === item.id 
              && <>
              <CartInfo item={item} active={active} setActive={setActive} equipment={equipment}></CartInfo> 
              <div className={`button text medium`} 
              onClick={() => setActive(null)}>
                    Save</div>
              </>
        }
      </div>
      }
    </div>
  )
}
