import React, { useEffect, useState } from 'react'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'
import setBannerMessage from '../../functions/bannerMessage'

export default function GuestHome({ setMessage, setUser }) {
  const [viewLogin, setViewLogin] = useState(false)
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
    <div className={styles.main}>
      <Register
        viewRegister={viewRegister}
        setViewRegister={setViewRegister}
        setMessage={setMessage}
        setViewLogin={setViewLogin}>
      </Register>
      {!viewLogin 
      ? <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={`text`}>Welcome to BookL47</h1>
            <p className={`text`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, quos?</p>
          </div>
          <div className={`text`}>Image goes here</div>
          <div>
            <div onClick={() => setViewLogin(true)} className={`${styles.registerLink} text`}>Sign in</div>
            <div className={`text`}>First time? <span onClick={() =>  setViewRegister(true)}
              className={`${styles.registerLink} text`}>
                Create an account!
              </span>
            </div>

          </div>
        </div>
      : <div className={styles.mainFormContainer}>
        <p onClick={() => {
          setViewLogin(false)
        }
        } className={`${styles.backLink} medium text`}>Back</p>
          <div className={styles.loginContainer}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={`${styles.field} text`}>
                <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=' '
                required
                />
                <label htmlFor="email">miles@jazz.com</label>
              </div>
              <div className={`${styles.field} text`}>
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
                type="button"
                onClick={togglePassword}
                > {passwordType === "password" ? "Show" : "Hide"}
                </div>
              </div>
              <div className={styles.buttonContainer}><button type="submit" className={`${styles.button} text`}>Login</button></div>
            </form>

          <div onClick={() => {
            setViewRegister(true)
          }} className={`${styles.registerLink} text`}>Create an account</div>
          </div>
        </div>
      }
      
      
    </div>
  )
}
