'use client'
import { FormEvent, useState } from 'react'
import { Button, Container, FloatingLabel, Form, Stack } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import useLoading from '@/stores/loading/LoadingStore';

interface LoginForm {
  username: string,
  password: string,
}

const loginFormDefault: LoginForm = {
  username: "",
  password: "",
}

function Login() {
  const router = useRouter();
  const setLoading = useLoading((state) => state.setLoading)
  const [loginForm, setLoginForm] = useState<LoginForm>(loginFormDefault);
  const [showPassword, setShowPassword] = useState<boolean>(false);


  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginForm.username == 'akbar' && loginForm.password == "akbar123") {
      setLoading(true);
      document.cookie = 'login=true; path=/';
      router.push("/media/dashboard");
    } else {
      toast.error("username / password salah!");
      setLoginForm({...loginForm, password: ""})
    }
  }


  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Form className="w-50" style={{ maxWidth: '500px' }} onSubmit={onSubmit}>
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
          <Button type="submit" variant="primary" className="w-auto align-self-start">Login</Button>
        </Stack>
      </Form>
    </Container>
  )
}

export default Login