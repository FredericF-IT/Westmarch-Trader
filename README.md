# The Westmarch Trader
The Westmarch Trader is a Discord bot to help you run your DnD westmarch discord server!

It supports
- Registering characters
- Downtimes
- Buying and selling of items
- Creating logs after a game is over

Use `/explaintrader` to print an explanation of all commands.
This command can be repeated to update the existing messages.
The bot will delete old messages from himself if there are more than needed to print all explanations.

# Setting up the bot
## Installation
First, clone this git repository to the device that will be running the bot.

Install `npm` and `sqlite3`, then move to `./Trading/`

Here, you will need to install:
- `npm install pm2`
- `npm install discord.js`
- `npm install sqlite`
- `npm install dotenv`
- `npm install discord-interactions`
- `npm install node-fetch`

## Bot Account
### .env Keys
You can follow [this official guide](https://discord.com/developers/docs/quick-start/getting-started#step-1-creating-an-app) to set up your bots discord account.

`/Trading/.env` needs to know the three keys of your bot to work:
- Application ID (Found in the `General Information` tab)
- Public Key (Found in the `General Information` tab)
- Discord Token (Found in the `Bot` tab, this is only displayed once!)

To stop git from wanting to share your private key, use

`git update-index --assume-unchanged ./Trading/.env`
### .env Channels
`/Trading/.env` will also need to know the channels it should send specific messages to.

Using Discord Developer mode, copy the channel ID's and replace the existing ones.
- DOWNTIME_LOG_CHANNEL will be used to send the outcomes of a downtime activity,

  as well as start threads for multi-stage downtimes like crafting.
- TRANSACTION_LOG_CHANNEL will be used to send receipts for transactions using `/westmarch buy` or `/westmarch sell`
- CHARACTER_TRACKING_CHANNEL is where your character sheets / threads are.
  
  The bot will offer copy/pastable summaries of transactions and downtimes, and link this channel as the target.
- GAME_LOG_CHANNEL will be used to display the logs created using `/westmarch logbook`

### Additional Settings
In `utils.js`, you can set some extra parameters:

- currency (default is `"gp"`)
- RESET_DAY is when the downtime resets each week. 0 is sunday, 1 is monday, ...
- RESET_HOUR is the time of the reset.

  These two settings are in the local timezone of the machine running the bot.
## Installation (On your discord server)
In the `Installation` tab, You should select the `applications.commands` and `bot` Scopes.

You should then add the `Create Public Threads`, `Send Messages`, and `Send Messages in Threads` permissions.

It is recommanded that you only allow the `Guild Install` method.

In the `Install Link` section, a link will be displayed.

Open it and select the server you want the bot to join.



Finally, start the app via

`pm2 start app.js --watch --ignore-watch="./Trading/data" -f`

Then open ./Trading/app.js, scroll all the way down, and set shouldUpdate to true to install the commands.

After saving the file wait a few seconds, set it back to false and save again.

Now thew bot should have its commands available in your server.
