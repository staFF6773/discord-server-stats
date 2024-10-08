import { ActivityType, Client, GatewayIntentBits, EmbedBuilder, ChannelType } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
  ],
});

client.once('ready', () => {
  console.log('Bot connected to Discord');

  // Set bot status
  client.user?.setPresence({
    activities: [
      { name: 'Gathering statistics from your server', type: ActivityType.Watching }
    ],
    status: 'online',
  });

  // Start the ping interval to keep the bot alive every 5 minutes
  setInterval(() => {
    console.log('Pinging to keep the bot alive');
    // You can add any simple operation that keeps the bot responsive here
  }, 300000); // Ping every 5 minutes (300,000 ms)
});

// Event when the bot joins a new guild
client.on('guildCreate', async (guild) => {
  // Create an embed message
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Hello! I am **Server Stats**')
    .setDescription('🎉 **Thank you for adding me to your server!**\n\n' +
                    'I am here to help you gather statistics about your server and display them on your webpage.')
    .addFields(
      { name: '📊 Information', value: 'You can start using me at any time. I am ready to help you with useful statistics.', inline: false },
      { name: '🔗 Server URL', value: `https://discord-server-stats.domcloud.dev//serverStats?id=${guild.id}`, inline: true },
    )
    .setFooter({ text: 'If you need help, feel free to ask me!' })
    .setTimestamp()
    .setThumbnail(client.user?.displayAvatarURL() || '');

  // Get the first text channel in the guild
  const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);

  // Send the embed if a text channel is found
  if (channel) {
    await channel.send({ embeds: [embed] });
  }
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
});

// Login with error handling
client.login(DISCORD_BOT_TOKEN).catch(err => {
  console.error('Failed to login:', err);
});

export default client;
