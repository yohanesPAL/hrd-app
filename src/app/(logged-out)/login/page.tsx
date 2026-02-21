"use client"
import { Container } from 'react-bootstrap'
import { useLogin } from '@/features/login/hooks/useLogin';
import LoginForm from '@/features/login/components/LoginForm';

function Login() {
  const {onLogin, loading} = useLogin()

  const loginHandler = async (username: string, password: string) => {
    onLogin(username, password)
  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <LoginForm loading={loading} loginHandler={loginHandler}/>
    </Container>
  )
}

export default Login