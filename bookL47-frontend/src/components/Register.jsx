import React, { useState, useEffect, useRef } from 'react'
import styles from './styles/Register.module.css'

export default function Register({viewRegister, setViewRegister, setViewLogin, setHomeMessage}) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: ""
  });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: ""
    })

    const [touched, setTouched] = useState({})

    const [passwordType, setPasswordType] = useState("password");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            }));
        
    };

    const handleBlur = (e) => {
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

    const handleClick = () => {
        setViewRegister(false)
        setViewLogin(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentErrors = Object.values(errors)
        if (!currentErrors.every((val) => val === '')) return
        
        console.log(formData)
        setHomeMessage('Account created successfully!')
        setFormData((prev) => {
            return Object.keys(prev).reduce((acc, key) => {
                acc[key] = ''
                return acc
            }, {})
        });
    }
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
            case value.length < 8:
            return "Must be at least 8 characters.";

            case !/[A-Z]/.test(value):
            return "Must include an uppercase letter.";

            case !/[0-9]/.test(value):
            return "Must include a number.";

            case !/[!@#$%^&*(),.?\":{}|<>]/.test(value):
            return "Must include a special character.";

            case formData.password !== formData.confirm:
            return "Passwords must match."
            
            default:
            return "";
        }
    };
    const validateField = (name, value) => {
        switch (name) {
            case "firstName":
                return value.trim() ? "" : "First name required.";
            case "lastName":
                return value.trim() ? "" : "Last name required.";
            case "email":
                return value.includes("@") ? "" : "Enter a valid email address.";
            case "password":
                return validatePassword(value)
            case "confirm":
                return validateConfirmPassword(value)
        }
    }   
    const dialogRef = useRef(null)
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) {
            return
        }
        if (viewRegister) {
            dialog.showModal()
        } else {
            dialog.close()
        }
    }, [viewRegister])
    const handleCancel = (e) => {
        e.preventDefault()
        setViewRegister(false)
    }
  return (
    <dialog
        className={styles.dialog}
        ref={dialogRef}
        onCancel={handleCancel}
        autoFocus>
        <div className={styles.registerContainer}>
            <div className={`${styles.closeButton} bold`}>
                <span onClick={() => {
                setViewRegister(false)}}>
                    Close
                </span>
            </div>
            <div className={styles.header}>
                <h1>Create a free account today and start booking!</h1>
                <p>Already have an account? <span className={styles.link} onClick={() => handleClick()}>Sign in!</span></p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                    <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="firstName">First Name</label>
                </div>
                {errors.firstName && (<p className={`${styles.error} bold small`}> {errors.firstName}</p>)}

                <div className={styles.field}>
                    <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="lastName">Last Name</label>
                </div>
                {errors.lastName && (<p className={`${styles.error} bold small`}> {errors.lastName}</p>)}

                <div className={styles.field}>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=' '
                    required
                    />
                    <label htmlFor="email">miles@jazz.com</label>
                </div>
                {errors.email && (<p className={`${styles.error} bold small`}> {errors.email}</p>)}

                <div className={styles.field}>
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
                    type="button"
                    onClick={togglePassword}
                    > {passwordType === "password" ? "Show" : "Hide"}
                    </div>
                </div>
                {errors.password && (<p className={`${styles.error} bold small`}> {errors.password}</p>)}
                <div className={styles.field}>
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
                {errors.confirm && (<p className={`${styles.error} bold small`}> {errors.confirm}</p>)}
                <div className={styles.buttonContainer}><button type="submit" className={styles.button}>Register</button></div>
                
            </form>
        </div>
    </dialog>
  )
}
