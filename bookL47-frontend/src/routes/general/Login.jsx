import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';
import styles from './styles/Login.module.css'
import setBannerMessage from '../../functions/bannerMessage';
import Register from '../../components/Register';
import { UserContext } from '../../contexts/UserContext';

export default function Login() {
      const API = import.meta.env.VITE_API_URL
      const navigate = useNavigate()
      const { setMessage } = useOutletContext()
      const { setUser } = useContext(UserContext)
      const [viewRegister, setViewRegister] = useState(false)
      const [formData, setFormData] = useState({
              email: "",
              password: ""
        });
      const [passwordType, setPasswordType] = useState("password");
      const [errors, setErrors] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            }));
      };
      const togglePassword = () => {
        setPasswordType((prev) =>
        prev === "password" ? "text" : "password"
        );
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        const currentFields = Object.values(formData)
        if (currentFields.every((val) => val === '')) return

        try {
          const res = await fetch(`${API}/login`, {
            method:"POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email.toLowerCase(),
              password: formData.password
            })
          })
          const data = await res.json()
          setUser(data)
          navigate('/')
          setBannerMessage(setMessage, "Signed in!", false, 5)
        } catch(error) {
          setFormData((prev) => {
            return {...prev, email: '', password: ''}
          })
          setBannerMessage(setMessage, "Invalid email or password!", true, 3)
          console.log(error)
        }
      }

      async function handleReset() {
        console.log(formData.email)
        if (formData.email === '') {
          return setBannerMessage(setMessage, "Please enter a valid email", true, 3)
        }
        try {
          const res = await fetch(`${API}/password-forgot`, {
            method:"POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email.toLowerCase()
            })
          })
          setBannerMessage(setMessage, "If the account exists, you will receive a password reset link shortly.", false, 5)
          setFormData((prev) => {
            return Object.keys(prev).reduce((acc, key) => {
                acc[key] = ''
                return acc
            }, {})
          });
        } catch(error) {
            console.log(error)
        }
      }
    
      useEffect(() => {
        setMessage({text: '', error: false})
      }, [ viewRegister])
  return (
    <div className={styles.mainFormContainer}>
      <div className='large text thin'>Sign In</div>
            <Register
              viewRegister={viewRegister}
              setViewRegister={setViewRegister}
              setMessage={setMessage}>
            </Register>
              <div className={styles.loginContainer}>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={`${styles.field} text medium`}>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="email">example@afm47.org</label>
                  </div>
                  <div className={`${styles.field} text medium`}>
                    <input
                    id="password"
                    name="password"
                    type={passwordType}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="password">Password</label>
                    <div
                    className={styles.showHide}
                    type="button"
                    onClick={togglePassword}
                    > {passwordType === "password" ? "Show" : "Hide"}
                    </div>
                  </div>
                  <div className={`${styles.forgotContainer} text small link`}><p onClick={() => handleReset()}>Forgot password?</p></div>
                  <div className={`${styles.buttonContainer}`}><button type="submit" className={`${styles.button} button text medium`}><span>Sign In</span></button></div>
                </form>
    
              <div  className={`${styles.registerLink} text`}> Don't have an account? <span className={`link`}onClick={() => {
                setViewRegister(true)
              }}>Create one!</span></div>
              </div>
            </div>
  )
}
