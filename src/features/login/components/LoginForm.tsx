"use client";
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap';
import styles from "../css/login.module.css"
import { useState } from 'react';
import { Credential } from '@/modules/login/login.schema';

const loginFormDefault: Credential = {
  username: "",
  password: "",
}

const LoginForm = ({ loading, loginHandler }: { loading: boolean, loginHandler: (username: string, password: string) => void }) => {
  const [loginForm, setLoginForm] = useState<Credential>(loginFormDefault);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Form className="w-50" style={{ maxWidth: '500px' }}
      onSubmit={(e) => {
        e.preventDefault();
        loginHandler(loginForm.username, loginForm.password);
      }}>
      <Stack gap={4} className="p-4 bg-white border rounded">
        <div>
          <h2 className="mb-0">Perdana Adhi Lestari</h2>
          <small>HR System</small>
        </div>
        <h2>Login</h2>
        <FloatingLabel controlId="username" label="username">
          <Form.Control
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.currentTarget.value })}
            required
          />
        </FloatingLabel>
        <Form.Group className={`mb-3 ${styles.passwordWrapper}`}>
          <FloatingLabel label='Password' className='d-flex justify-content-between align-items-center'>
            <Form.Control
              className={styles.passwordInput}
              placeholder='Password'
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.currentTarget.value })}
              required
            />
            <span
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <i className="bi bi-eye fs-4"></i> : <i className="bi bi-eye-slash fs-4"></i>}
            </span>
          </FloatingLabel>
        </Form.Group>
        <Button type="submit" variant="primary" className={`w-auto align-self-start`} disabled={loading}>
          <span hidden={!loading} className="spinner-border spinner-border-sm" style={{marginRight: "4px"}}></span>
          <span hidden={loading}>Login</span>
        </Button>
      </Stack>
    </Form>
  )
}

export default LoginForm