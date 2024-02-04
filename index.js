const { Client, Intents, MessageActionRow } = require('discord.js');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ]
});


client.on('messageCreate', async msg => {

  if (msg.content.startsWith("$nick")) {
    const regex = /<@(\d+)>(.*)/;

    // Use the match method to extract the number and the text after it
    const match = msg.content.match(regex);

    // Check if a match is found
    if (match) {
      const userNumber = match[1];
      const intendedUserId = match[2].trim(); // Trim to remove leading/trailing spaces

      work(userNumber, msg, intendedUserId);
    } else {
      msg.reply("That didn't work :(. The syntax is $nick (user) (new nickname)");
    }
  }

  getIntendedName(msg);

});

var namesdb = null;

console.log("OPENING");
open({
  filename: './database',
  driver: sqlite3.Database
}).then(async (db) => {
  console.log("DB CONNECTED");
  const res = await db.all('SELECT * FROM key')
  namesdb = db;
  var key = res[0].key;
  console.log("KEY GOT");
  client.login(key);
  console.log("LOGGED IN")
});

async function work(userNumber, msg, textAfterNumber) {
  const guild = await client.guilds.fetch(msg.guildId);
 
      const user = await guild.members.cache.find(member => member.id === userNumber);
      try {
        await namesdb.run('DELETE FROM names WHERE GuildID = ? AND UserID = ?', [msg.guildId, user.id])
        await namesdb.run('INSERT INTO names (GuildID, UserID, Nickname) VALUES (?,?,?)', [msg.guildId, user.id, textAfterNumber])
        await user.setNickname(textAfterNumber, "Funny");
        
        msg.reply("<@" + userNumber + "> your nickname has been set :)");
      }
      catch (e) {
        msg.reply("<@" + userNumber + "> change ur nickname to ```" + textAfterNumber + "``` NOW!!! \n (SERVER ADMIN MAKE SURE BOT PERM ROLE IS ABOVE ALL OTHERS)");
      }
}

async function getIntendedName(msg) {
  guild = msg.guildId;
  user = msg.author.id;
  console.log(user)
  
  const res = await namesdb.all('SELECT Nickname FROM names WHERE GuildID = ? AND UserID = ?', guild, user)
 
  if (res.length > 0 ) {
    const name = res[0].Nickname
    const guild = await client.guilds.fetch(msg.guildId);
    
    const nuser = await guild.members.cache.find(member => member.id === user);
    
    if (nuser.nickname == null || nuser.nickname.toLowerCase().trim() != name.toLowerCase().trim()) {
      work(user, msg, name)
    }
  
  }
}