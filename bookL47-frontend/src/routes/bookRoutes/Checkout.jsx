import React, { useEffect, useState, useRef, useContext } from 'react'
import { useOutletContext } from 'react-router'
import styles from './styles/Checkout.module.css'
import { CartContext } from '../../contexts/CartContext'
import { formatDate, formatTime, createTotal, createFee } from '../../functions/formatter.js'


const appId = import.meta.env.VITE_SANDBOX_SQUARE_APP_ID
const locationId = import.meta.env.VITE_SANDBOX_SQUARE_LOCATION_ID
const API = import.meta.env.VITE_API_URL



export default function Checkout() {
    const { user, setMessage} = useOutletContext()
    const { cart, getCart, setCart, deleteCartItem } = useContext(CartContext)
    const cardRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        const res = fetch(`${API}/checkout`, {
            method: "POST",
            credentials: "include"
        })
        if (initializedRef.current) return
        initializedRef.current = true
        const square = window.Square;
        if (!square) return;
        const cardOptions = {
            style: {
                input: {
                    backgroundColor: "white",
                }
            }
        }
        async function init() {
            try {
                const payments = await square.payments(appId, locationId);
                const card = await payments.card(cardOptions);
                cardRef.current = card
                await card.attach("#card");
                const cart = await getCart()
                setCart(cart)
            } 
            catch(error) {
                console.log(error)
            }     
        }
        init();
    }, []);
    async function handleClick() {
        if (!cardRef.current) return
        try {
            const result = await cardRef.current.tokenize()
            console.log(result)

        }
        catch(error) {
            console.log(error)

        }

    }
  return (
    <div className={styles.main}>
        <div className={styles.sideCheckout}>
            <div className={`${styles.title} large text`}>Your Cart</div>
            <ul className={`${styles.cart}`}>
                {cart.map((item) => {
                    return (
                        <li key={item.id} className={`${styles.itemContainer}`}>
                            <div className={`${styles.lineItem}`}>
                                <div>
                                    <div className={`${styles.date} text bold`}>{formatDate(item.date)}</div>
                                    <div className={`${styles.time} text small`}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
                                </div>
                                <div className={`${styles.price} text`}>{`$${item.price}`}</div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className={`${styles.subTotal}`}>
                <span className='text regular bold'>Subtotal:</span>
                <div className={`${styles.priceTotal} text regular bold`}>{`$${createTotal(cart)}`}
                </div>
            </div>
            <div className={`${styles.processingFee}`}>
                <span className='text regular'>Processing Fee:</span>
                <div className={`${styles.feeTotal} text regular`}>{`$${createFee(createTotal(cart), 0.033, 0.30)}`}
                </div>
            </div>
            <div className={`${styles.totalDue}`}>
                <span className='text medium bold'>Total due:</span>
                <div className={`${styles.total} text medium bold`}>{`$${createTotal(cart) + Number(createFee(createTotal(cart), 0.033, 0.30))}`}
                </div>
            </div>


        </div>
        <div className={`${styles.sideSquare}`}>
            <div id='card' className={`${styles.card} text`}></div>
            <div className={`${styles.payButton} text bold`} onClick={() => handleClick()}>Secure checkout</div>
        </div>
        
    </div>
  )
}
