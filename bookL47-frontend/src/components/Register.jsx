import React, { useState, useEffect, useRef } from 'react'
import styles from './styles/Register.module.css'

export default function Register({viewRegister, setViewRegister}) {
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [passwordType, setPasswordType] = useState("password");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
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
        ref={dialogRef}
        onCancel={handleCancel}>
        <div className={styles.registerContainer}>
            <div className={styles.closeButton} onClick={() => {
                setViewRegister(false)
            }}>close</div>
            <form>
                <div>
                    <label htmlFor="firstName">First name</label>
                    <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                </div>

                <div>
                    <label htmlFor="lastName">Last name</label>
                    <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                </div>

                <div>
                    <label htmlFor="email">name@example.com</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                </div>

                <div>
                    <label htmlFor="password">Enter password</label>
                    <input
                    id="password"
                    name="password"
                    type={passwordType}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                    <div
                    type="button"
                    onClick={togglePassword}
                    > {passwordType === "password" ? "Show" : "Hide"}
                    </div>
                </div>
                <div>
                    <label htmlFor="confirm">Confirm password</label>
                    <input
                    id="password"
                    name="password"
                    type={passwordType}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=' '
                    required
                    />
                    <div
                    type="button"
                    onClick={togglePassword}
                    > {passwordType === "password" ? "Show" : "Hide"}
                    </div>
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    </dialog>
  )
}
