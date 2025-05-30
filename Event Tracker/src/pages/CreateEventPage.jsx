import EventForm from '../components/events/EventForm'

const CreateEventPage = () => {
  return (
    <div className="mt-16 min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create an Event</h1>
          <EventForm />
        </div>
      </div>
    </div>
  )
}

export default CreateEventPage