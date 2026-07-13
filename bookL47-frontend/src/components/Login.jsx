import React, { useContext, useEffect, useState } from 'react'
import styles from './styles/Login.module.css'
import setBannerMessage from '../functions/bannerMessage';
import { UserContext } from '../contexts/UserContext';

export default function Login({ formData, setFormData, setViewRegister, viewRegister, setViewLogin, viewLogin, passwordType, setPasswordType, setMessage }) {
    const { setUser } = useContext(UserContext)
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
        const API = import.meta.env.VITE_API_URL
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
        } catch(error) {
          setFormData((prev) => {
            return {...prev, email: '', password: ''}
          })
          setBannerMessage(setMessage, "Invalid email or password", true, 5)
          console.log(error)
        }
      }
    
      useEffect(() => {
        setMessage({text: '', error: false})
      }, [viewLogin, viewRegister])
  return (
    <div className={styles.mainFormContainer}>
            <p onClick={() => {
              setViewLogin(false)
            }
            } className={`${styles.backLink} medium text link`}>Back</p>
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
                  <div className={`${styles.buttonContainer}`}><button type="submit" className={`${styles.button} button text medium`}><span>Sign In</span></button></div>
                </form>
    
              <div  className={`${styles.registerLink} text`}> Don't have an account? <span className={`link blue`}onClick={() => {
                setViewRegister(true)
              }}>Create one!</span></div>
              </div>
            </div>
  )
}
