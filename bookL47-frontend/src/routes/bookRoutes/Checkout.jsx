import React, { useEffect, useState, useRef, useContext } from 'react'
import { useOutletContext } from 'react-router'
import styles from './styles/Checkout.module.css'
import { CartContext } from '../../contexts/CartContext'


const appId = import.meta.env.VITE_SANDBOX_SQUARE_APP_ID
const locationId = import.meta.env.VITE_SANDBOX_SQUARE_LOCATION_ID
const API = import.meta.env.VITE_API_URL



export default function Checkout() {
    const { user, setMessage} = useOutletContext()
    const { cart } = useContext(CartContext)
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
                    backgroundColor: "white"
                }
            }
        }
        async function init() {
            try {
                const payments = await square.payments(appId, locationId);
                const card = await payments.card(cardOptions);
                cardRef.current = card
                await card.attach("#card");
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
    <div>
        <div>
            <ul>
                {cart.map((item) => {
                    return (
                        <li key={item.id}>
                            <div>{item.date}</div>
                            <div>{`${item.start} - ${item.end}`}</div>
                            {user.role === 'member' 
                            ? <div>{item.price}</div>
                            : <div>TBD</div>}
                            <div></div>

                        </li>
                    )
                })}
            </ul>
        </div>
        <div id='card' className={`${styles.card} text`}></div>
        <div className={`${styles.payButton} text`} onClick={() => handleClick()}>Pay</div>
    </div>
  )
}
