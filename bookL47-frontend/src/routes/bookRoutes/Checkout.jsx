import React, { useEffect, useState, useRef, useContext } from 'react'
import { useOutletContext } from 'react-router'
import styles from './styles/Checkout.module.css'
import { CartContext } from '../../contexts/CartContext'
import { formatDate, formatTime, createTotal, createFee } from '../../functions/formatter.js'
import { UserContext } from '../../contexts/UserContext.jsx'
import Loading from '../../components/Loading.jsx'
import setBannerMessage from '../../functions/bannerMessage.js'


const appId = import.meta.env.VITE_SANDBOX_SQUARE_APP_ID
const locationId = import.meta.env.VITE_SANDBOX_SQUARE_LOCATION_ID
const API = import.meta.env.VITE_API_URL


//helper functions

async function CreatePayment(token) {
  const body = JSON.stringify({
    locationId,
    sourceId: token,
    idempotencyKey: window.crypto.randomUUID(),
  });

  const paymentResponse = await fetch(`${API}/payment`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (paymentResponse.ok) {
    return paymentResponse.json();
  }

  const errorBody = await paymentResponse.text();
  throw new Error(errorBody);
}

async function tokenize(card, verificationDetails) {
  const tokenResult = await card.tokenize(verificationDetails);
  if (tokenResult.status === 'OK') {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(
        tokenResult.errors
      )}`;
    }
    throw new Error(errorMessage);
  }
}


export default function Checkout() {
    const { setMessage } = useOutletContext()
    const { user, loading: userLoading } = useContext(UserContext)
    const { cart, getCart, setCart, deleteCartItem, loading: cartLoading } = useContext(CartContext)
    const [loading, setLoading] = useState(true)
    const [loadingCheckout, setLoadingCheckout] = useState(true)
    const [activePayButton, setActivePayButton] = useState(true)
    const cardRef = useRef(null);
    const initializedRef = useRef(false);

    const subtotal = createTotal(cart).toFixed(2);
    const fee = Number(createFee(subtotal, 0.033, 0.30));
    const amount = (Number(subtotal) + fee).toFixed(2)

    useEffect(() => {
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
                if (!userLoading && !cartLoading) {
                    setLoading(false)
                }
                const payments = await square.payments(appId, locationId);
                const card = await payments.card(cardOptions);
                cardRef.current = card
                const cart = await getCart()
                await card.attach("#card");
                setCart(cart)
                setLoadingCheckout(false)
                console.log('checkout loaded')    
            } 
            catch(error) {
                console.log(error)
                console.log('failed to load')
                setLoading(false)
                setLoadingCheckout(false)  
            }     
        }
        init();
    }, []);
    async function handleClick() {
        setActivePayButton(false)
        if (!cardRef.current) return
        let card = cardRef.current
        const verificationDetails = { 
            amount,
            billingContact: {
                givenName: user.first_name,
                familyName: user.last_name,
                email: user.email,
            },
            currencyCode: 'USD',
            intent: 'CHARGE',
            customerInitiated: user.role !== 'admin',
            sellerKeyedIn: user.role === 'admin',
        };
        try {
            const tokenResult = await tokenize(card, verificationDetails)
            const paymentResults = await CreatePayment(tokenResult);
            setActivePayButton(true)
            setBannerMessage(setMessage, 'Payment successful', false, 5)
            
        }
        catch(error) {
            console.log(error)
            setActivePayButton(true)
            setBannerMessage(setMessage, 'Payment unsuccessful', true, 5)
            
        }
    }
    if (loading) {
        return (
            <Loading></Loading>
        )
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
                                    <div className={`${styles.time} text small`}>{`${formatTime(item.start)} - ${formatTime(item.end)} (${item.hours} hrs)`}</div>
                                </div>
                                {user.role === 'member' || user.role === 'life'
                                ? <div className={`${styles.price} text`}>{`$${item.price}`}</div>
                                : <div className={`${styles.price} text`}>{`$${(item.price).toFixed(2)}`}</div>}
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className={`${styles.subTotal}`}>
                <span className='text regular bold'>Subtotal:</span>
                <div className={`${styles.priceTotal} text regular bold`}>{subtotal}
                </div>
            </div>
            <div className={`${styles.processingFee}`}>
                <span className='text regular'>Processing Fee <em>(2.9% + $0.30)</em>:</span>
                <div className={`${styles.feeTotal} text regular`}>{fee}
                </div>
            </div>
            <div className={`${styles.totalDue}`}>
                <span className='text medium bold'>Total due:</span>
                <div className={`${styles.total} text medium bold`}>{amount}
                </div>
            </div>


        </div>
        <div className={`${styles.sideSquare}`}>
            {loadingCheckout ? <Loading></Loading> : <></>}
            <div className='text large'>Enter payment details:</div>
            <div className={styles.checkoutContainer}>
                <div id='card' className={`${styles.card} text`}></div>
                <div className={`${styles.payButton} text bold ${!activePayButton ? styles.disabled : ''}`} onClick={() => handleClick()}>Secure checkout</div>
            </div>  
        </div>
        
    </div>
  )
}
