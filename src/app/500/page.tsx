const InternalServerError = ({msg}:{msg: string}) => {
    return (
    <div>
      <h1>500</h1>
      <h3>Internal Server Error</h3>
      <p>{msg}</p>
    </div>
  )
}

export default InternalServerError