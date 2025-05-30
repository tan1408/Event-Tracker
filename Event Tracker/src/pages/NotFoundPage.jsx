import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

const NotFoundPage = () => {
  return (
    <div className="mt-16 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary">
              Go Home
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="outline">
              Explore Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage