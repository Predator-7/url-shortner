# URL Shortener

This is a lightweight URL shortening service I built to learn more about Node.js, Redis, and backend development. It allows you to take long, unwieldy URLs and transform them into short, manageable links that are easier to share.

## Key Features

- Create compact URLs from long web addresses
- Set custom expiration times for links
- Track how many times a short URL gets accessed
- Prevent abuse with built-in rate limiting

## Getting Started

### Prerequisites
- Node.js
- Redis

### Installation
```bash
git clone https://github.com/Predator-7/url-shortner
cd url-shortener
npm install
```

### Running the App
```bash
npm start
```

## Quick API Usage

### Shorten a URL
`POST /shorten`
```json
{
  "url": "https://google.com",
  "ttl": 2
}
```

### Check URL Stats
`GET /stats/:shortCode`

### Redirect
`GET /:shortCode`

