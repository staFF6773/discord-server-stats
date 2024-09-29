import express, { Request, Response } from 'express';
import path from 'path';
import client from './discordBot'; // Import the Discord client

const app = express();
const port = 8080;

// Serving static files and the main view
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/serverStats', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'serverStats.html'));
});

app.get('/server/:id', async (req: Request, res: Response): Promise<void> => {
  const serverId: string = req.params.id;

  try {
    const guild = await client.guilds.fetch(serverId);
    
    if (!guild) {
      res.status(404).send('Server not found, bot not found on server');
      return;
    }

    const recentMembers = guild.members.cache
      .filter(member => member.joinedTimestamp && Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000)
      .map(member => ({ id: member.id, username: member.user.username }))
      .slice(0, 5);

    const invites = await guild.invites.fetch();

    const serverData = {
      name: guild.name,
      memberCount: guild.memberCount,
      createdAt: guild.createdAt,
      ownerId: guild.ownerId,
      icon: guild.iconURL(),
      banner: guild.bannerURL({ size: 2048 }),
      invites,
      recentMembers,
    };

    res.json(serverData);
  } catch (error) {
    console.error('Error getting data from the server:', error);
    res.status(500).send('Error getting data from the server');
  }
});

// New API to obtain the number of servers
app.get('/botStats', (req: Request, res: Response) => {
  const guildCount = client.guilds.cache.size; // Gets the number of servers
  res.json({ guildCount });
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
