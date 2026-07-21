import React, { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import styles from './styles/Profile.module.css'
import { Link, useOutletContext } from 'react-router';
import setBannerMessage from '../../functions/bannerMessage';
import getUser from '../../functions/getUser';

export default function Profile() {
    const { user, setUser } = useContext(UserContext)
    const {setMessage} = useOutletContext()
    const API = import.meta.env.VITE_API_URL
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
  });
    const [ memberId, setMemberId] = useState('')

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
    })

    const [touched, setTouched] = useState({})
    const [passwordType, setPasswordType] = useState("password");
    const [allowEdit, setAllowEdit] = useState(false)
    const [allowUpdate, setAllowUpdate] = useState(true)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            }));
        
    };

    const handleBlur = (e) => {
        const currentFields = Object.values(formData)
        if (currentFields.every(val => val === '')) return
        const { name, value } = e.target
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }))
    }

    const togglePassword = () => {
    setPasswordType((prev) =>
        prev === "password" ? "text" : "password"
        );
    };

    async function handleReset() {
      try {
        const res = await fetch(`${API}/password-forgot`, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email
          })
        })
        setBannerMessage(setMessage, "You will receive a password reset link shortly.", false, 5)
      } catch(error) {
          console.log(error)
      }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!allowEdit) return
        const currentErrors = Object.values(errors)
        if (!currentErrors.every((val) => val === '')) return
        const currentFields = Object.values(formData)
        console.log(currentFields)
        if (currentFields.some((val) => val === '')) return
        try {
            setAllowUpdate(false)
            const res = await fetch(`${API}/profile`, {
                method:"PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email.toLowerCase(),
                })
            })
            const data = await res.json()
            if (res.status === 200) {
              setBannerMessage(setMessage, data.message, false, 5 )
              const userData = await getUser()
              setUser(userData)
              setAllowEdit(false)
            } else {
              setBannerMessage(setMessage, data.message, true, 3 )
            }
        } catch (error) {
            setBannerMessage(setMessage, `Error: Could not update account.`, true, 3)
            console.log(error)
        }
        setAllowUpdate(true)
    }
    const handleLink = async function () {
      if (memberId === '') return
      try {
        const res = await fetch(`${API}/link-account`,{
          method:"POST",
          credentials: 'include',
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              memberId,
          })
        })
        const data = await res.json()
        if (res.status === 200) {
          setBannerMessage(setMessage, data.message, false, 5)
          const userData = await getUser()
          setUser(userData)
        } else {
          setBannerMessage(setMessage, data.message, true, 3)
        }
      } catch (error) {
        setBannerMessage(setMessage, `Error: No matching account found.`, true, 3)
        console.log(error)
      }
    }
    const validateField = (name, value) => {
        switch (name) {
            case "firstName":
                return value.trim() ? "" : "First name required.";
            case "lastName":
                return value.trim() ? "" : "Last name required.";
            case "email":
                return value.includes("@") ? "" : "Enter a valid email address.";
        }
    }   
  return (
    
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={`text large thin`}>Your Profile</p>
                {!allowEdit 
                ? <p className='text regular link blue' onClick={() => setAllowEdit(true)}>Edit</p>
                : <p className='text regular link' onClick={() => {
                  setAllowEdit(false)
                  setFormData((prev) => {
                    return {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                    }
                  })
                }}>Undo</p>
                }
            </div>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={`${styles.field} text medium`}>
                    <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    disabled={!allowEdit}
                    required
                    />
                    <label htmlFor="firstName">First Name</label>
                </div>
                {errors.firstName && (<p className={`${styles.error} bold small text`}> {errors.firstName}</p>)}

                <div className={`${styles.field} text medium`}>
                    <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    disabled={!allowEdit}
                    required
                    />
                    <label htmlFor="lastName">Last Name</label>
                </div>
                {errors.lastName && (<p className={`${styles.error} bold small text`}> {errors.lastName}</p>)}

                <div className={`${styles.field} text medium`}>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    disabled={!allowEdit}
                    required
                    />
                    <label htmlFor="email">Email Address</label>
                </div>
                {errors.email && (<p className={`${styles.error} bold small text`}> {errors.email}</p>)}
                { allowUpdate
                ? <div className={styles.buttonContainer}><button type="submit" className={`${styles.button} text button medium ${!allowEdit ? styles.disabled : '' }`}><span>Update profile</span></button></div>
                : <div className={`text`}><span>Updating your account...</span></div>
                }
            </form>
            <div className='link small text'>Send reset password link?</div>
            {user.role === 'nonMember' 
            && <div className={styles.memberIdContainer}>
                  <div className='text medium'>Are you a member? <div className='small'>Log in to Ensemble 2.0 and enter your E2 account number below to receive your member discounts!</div></div>
                  <div className={`${styles.field} text medium`}>
                    <input
                    id="memberId"
                    name="memberId"
                    type='text'
                    value={memberId}
                    onChange={(e) => setMemberId(prev => e.target.value)}
                    onBlur={handleBlur}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="password">Ensemble Account No.</label>
                  </div>
                  <div className='button text medium' onClick={() => {handleLink()}}><div>Link Ensemble 2.0 account</div></div>
              </div>
            }
        </div>
  )
}
