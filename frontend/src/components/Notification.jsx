import { useEffect, useState } from 'react'

function Notification({ meetings }) {
  const [alerted, setAlerted] = useState([])

  useEffect(() => {
    if (window.Notification.permission !== 'granted') {
      window.Notification.requestPermission()
    }

    const interval = setInterval(() => {
      const now = new Date()

      meetings.forEach((meeting) => {
        const meetingTime = new Date(meeting.datetime)
        const diffMinutes = (meetingTime - now) / 1000 / 60

        if (diffMinutes <= 5 && diffMinutes > 4 && !alerted.includes(meeting._id)) {
          if (window.Notification.permission === 'granted') {
            new window.Notification(`Meeting starting soon: ${meeting.title}`)
          } else {
            alert(`Meeting starting soon: ${meeting.title}`)
          }
          setAlerted((prev) => [...prev, meeting._id])
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [meetings, alerted])

  return null
}

export default Notification