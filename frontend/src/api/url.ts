const baseProdUrl = import.meta.env.VITE_API_URL

export const apiUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : baseProdUrl
