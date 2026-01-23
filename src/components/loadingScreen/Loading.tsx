import { HashLoader } from "react-spinners"

const LoadingComp = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <HashLoader size={40} color="#ffffff"/>
      <span className="mt-3 text-white">Loading</span>
    </div>
  )
}

export default LoadingComp