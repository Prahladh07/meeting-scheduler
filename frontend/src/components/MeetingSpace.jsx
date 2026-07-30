import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import Notification from './Notification'

function MeetingSpace() {
  const { spaceId } = useParams()
  const [space, setSpace] = useState(null)
  const [meetings, setMeetings] = useState([])
  const [title, setTitle] = useState('')
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    fetchSpace()
    fetchMeetings()
  }, [])

  async function fetchSpace() {
    try {
      const res = await api.get(`/space/${spaceId}`)
      setSpace(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchMeetings() {
    try {
      const res = await api.get(`/space/${spaceId}/meetings`)
      setMeetings(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  async function scheduleMeeting() {
    if (title.trim() === '' || dateTime === '') {
      alert('fill in both fields')
      return
    }
    try {
      await api.post('/meeting/create', {
        spaceId: spaceId,
        title: title,
        datetime: dateTime
      })
      setTitle('')
      setDateTime('')
      fetchMeetings() // refresh list
    } catch (err) {
      console.log(err)
      alert('could not schedule meeting')
    }
  }

  return (
    <div className="meeting-space">
      {space && (
        <>
          <h2>{space.name}</h2>
          <p>Code: <b>{space.code}</b> (share this so others can join)</p>
          <p>Members: {space.members.map((m) => m.name).join(', ')}</p>
        </>
      )}

      <div className="card">
        <h3>Schedule a meeting</h3>
        <input
          type="text"
          placeholder="Meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <button onClick={scheduleMeeting}>Schedule</button>
      </div>

      <div className="card">
        <h3>Upcoming meetings</h3>
        {meetings.length === 0 && <p>No meetings yet</p>}
        <ul>
          {meetings.map((m) => (
            <li key={m._id}>
              {m.title} - {new Date(m.datetime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <Notification meetings={meetings} />
    </div>
  )
}

export default MeetingSpace