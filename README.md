# Discord Server Stats

## Description

**Discord Server Stats** is a Discord bot that collects statistics from your server and a web dashboard that allows you to visualize this data intuitively. With this tool, you can gain valuable insights into the activity and health of your server in real-time.

![image](https://github.com/user-attachments/assets/96a5f63d-ff70-46bf-bb1f-4b228277f0d7)

## Features

- **Discord Bot:** Collects real-time statistics from your Discord server.
- **Web Dashboard:** Intuitive web interface for data visualization.
- **No commands:** The bot does not use any command to store the information on the web.
- **Simple setup:** Uses a `.env` file to store configuration.

## Requirements

- Node.js
- npm
- Discord Bot Token

## Installation

1. Clone this repository to your local machine:

```bash
   git clone https://github.com/staFF6773/discord-server-stats.git
   cd discord-server-stats
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the project and add your Discord bot token:

```env
DISCORD_TOKEN=your_token_here
```

4. Start the bot and the dashboard server:

```bash
npm run dev - first this command to compile the ts
npm start - and finally this one to start the project
```

5. Open your browser and go to `http://localhost:8080` to access the dashboard.

# Contributions

Contributions are welcome. If you would like to contribute, please open an issue or submit a pull request.
