import { Outlet } from "react-router-dom"
import Layout from "../components/Layout"
import { useSearchParams } from "react-router-dom"

const ProtectionProvider = () => {
  const [searchParams] = useSearchParams()
  const printMode = searchParams.get('print')

  if (printMode) {
    return <Outlet />
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectionProvider