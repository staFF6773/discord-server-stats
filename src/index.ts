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

let totalDataSent = 0; // Contador total de datos enviados

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

    const responseData = JSON.stringify(serverData);
    totalDataSent += Buffer.byteLength(responseData, 'utf8'); // Calculate the size of the data sent

    res.json(serverData);
  } catch (error) {
    console.error('Error getting data from the server:', error);
    res.status(500).send('Error getting data from the server');
  }
});

// New API to obtain user profile information
app.get('/userProfile/:serverId/:userId', async (req: Request, res: Response): Promise<void> => {
  const serverId: string = req.params.serverId;
  const userId: string = req.params.userId;

  try {
    const guild = await client.guilds.fetch(serverId);
    const member = await guild.members.fetch(userId);

    if (!member) {
      res.status(404).send('User not found in the server');
      return;
    }

    // Fetch the complete user profile, including the banner
    const fullUser = await member.user.fetch();

    const activities = member.presence?.activities.map(activity => ({
      type: activity.type,
      name: activity.name,
      details: activity.details,
      state: activity.state,
    })) || [];

    const userProfile = {
      id: member.id,
      username: fullUser.username, // Use fullUser for all profile details
      avatar: fullUser.displayAvatarURL(),
      banner: fullUser.bannerURL({ size: 2048 }) || null, // Use fullUser to get banner, handle if null
      decoration: fullUser.accentColor,
      timeInCommunity: new Date(member.joinedTimestamp ?? 0).toISOString(),
      status: member.presence?.status || 'offline', // User status (online, idle, dnd, offline)
      activities: activities.length > 0 ? activities : null,
    };

    const responseData = JSON.stringify(userProfile);
    totalDataSent += Buffer.byteLength(responseData, 'utf8'); // Calculate the size of the data sent

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
});


app.get('/userProfile', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'userProfile.html'));
});

// New API to obtain data traffic
app.get('/dataTraffic', (req: Request, res: Response) => {
  res.json({ totalDataSent });
});


// New API to obtain the number of servers
app.get('/botStats', (req: Request, res: Response) => {
  const guildCount = client.guilds.cache.size; // Gets the number of servers
  res.json({ guildCount });
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
