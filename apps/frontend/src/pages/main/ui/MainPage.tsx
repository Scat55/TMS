import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const MainPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {/*<h1 className="text-2xl text-red-600">MAIN PAGE</h1>*/}
      <Button onClick={() => navigate('/auth')}>Click me</Button>
    </div>
  )
}
export default MainPage
