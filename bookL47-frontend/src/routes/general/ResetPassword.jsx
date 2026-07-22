import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router';
import setBannerMessage from '../../functions/bannerMessage';
import styles from './styles/ResetPassword.module.css'
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useEffect } from 'react';
import Loading from '../../components/Loading.jsx'

export default function ResetPassword() {
    const {setUser} = useContext(UserContext)
    const { setMessage } = useOutletContext()
    const API = import.meta.env.VITE_API_URL
    const location = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [allowUpdate, setAllowUpdate] = useState(true)
    const [formData, setFormData] = useState({
            password: "",
            confirm: ""
    });
    const [errors, setErrors] = useState({
            password: "",
            confirm: ""
    })
    const [passwordType, setPasswordType] = useState("password");

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const token = params.get("token");
        if (!token) {
            navigate('/')
            return
        }
        setLoading(false)

    }, [])

    if (loading) {
        return (<Loading></Loading>)
    }
    const togglePassword = () => {
    setPasswordType((prev) =>
        prev === "password" ? "text" : "password"
        );
    };
    const validatePassword = (value) => {
        switch (true) {
            case value.length < 8:
            return "Must be at least 8 characters.";

            case !/[A-Z]/.test(value):
            return "Must include an uppercase letter.";

            case !/[0-9]/.test(value):
            return "Must include a number.";

            case !/[!@#$%^&*(),.?\":{}|<>]/.test(value):
            return "Must include a special character.";

            default:
            return "";
        }
    };
    const validateConfirmPassword = (value) => {
        switch (true) {
            case formData.password !== formData.confirm:
            return "Passwords must match."
            
            default:
            return "";
        }
    };
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
    const validateField = (name, value) => {
        switch (name) {
            case "password":
                return validatePassword(value)
            case "confirm":
                return validateConfirmPassword(value)
        }
    } 
    const handleSubmit = async (e) => {
            e.preventDefault();
            const params = new URLSearchParams(location.search)
            const token = params.get("token");
            const currentErrors = Object.values(errors)
            if (!currentErrors.every((val) => val === '')) return
            const currentFields = Object.values(formData)
            if (currentFields.some((val) => val === '')) return
            try {
                setAllowUpdate(false)
                const res = await fetch(`${API}/password-reset`, {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password: formData.password
                    })
                })
                console.log(res.status)
                if (res.status === 200) {
                    setBannerMessage(setMessage, "Password updated successfully!", false, 5 )
                    setUser({ role: 'guest' })
                    navigate('/')
                } else {
                    setBannerMessage(setMessage, "Password updated failed.", true, 5 )
                    setAllowUpdate(true)
                }
            } catch (error) {
                setBannerMessage(setMessage, `Error: ${error}` ) , true, 3
                console.log(error)
            }
        }
  return (
    <div className={styles.main}>
        <div className={styles.header}>
            <h1 className={`text medium`}>Reset your password below:</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={`${styles.field} text medium`}>
                <input
                id="password"
                name="password"
                type={passwordType}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
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
            {errors.password && (<p className={`${styles.error} bold small text`}> {errors.password}</p>)}
            <div className={`${styles.field} text medium`}>
                <input
                id="confirm"
                name="confirm"
                type='password'
                value={formData.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=' '
                required
                />
                <label htmlFor="confirm">Confirm Password</label>
            </div>
            {errors.confirm && (<p className={`${styles.error} bold small text`}> {errors.confirm}</p>)}
            { allowUpdate
            ? <div className={styles.buttonContainer}><button type="submit" className={`${styles.button} text button medium`}><span>Update Password</span></button></div>
            : <div className={`text`}><span>Sending request...</span></div>
            }
        </form>
    </div>
  )
}
