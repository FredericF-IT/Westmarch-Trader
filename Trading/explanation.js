import { currency, DOWNTIME_LOG_CHANNEL, DOWNTIME_RESET_TIME, GAME_LOG_CHANNEL, TRANSACTION_LOG_CHANNEL } from "./utils.js";
import 'dotenv/config';


export const explanationMessage = [
`# The Trader Bot
I, <@${process.env.APP_ID}>, will help you with many westmarch activities on the server.
> # Register characters
> I will need to know your characters name, so you should add them:
> - You can register them via
> \`\`\`/westmarch character register name:\`\`\`
> - You can remove a character using
> \`\`\`/westmarch character unregister name:\`\`\`
> - You can see your registered characters via
> \`\`\`/westmarch character show\`\`\`
> You can have a maximum of **ten** characters registered with the bot.
> If a character is not registered, but is used in a command, I will automatically ask if you want to register the character.`
,
`> # Buying / Selling items
> **All transaction logs are sent to <#${TRANSACTION_LOG_CHANNEL}>, no matter where you used the command.**
> To create a trade prompt, use
> \`\`\`/westmarch buy item: character: amount:\`\`\` 
> or 
> \`\`\`/westmarch sell item: character: amount:\`\`\`
> I require the options \`item\` and \`character\` to know who's buying what.
> Optionally, you can buy multiple of the same item at once with the option \`amount\`
> 
> Before the transaction happens, the price of the item is displayed in a message (prompt). 
> You can ignore the message, or accept the transaction by clicking the confirmation button.`
,
`> # Downtimes
> **All downtime activities are sent to <#${DOWNTIME_LOG_CHANNEL}>, no matter where you used the command.**
> \`\`\`/westmarch downtime activity: character: level:\`\`\`
> There are currently three options. More may be added later.
> - Doing a job:
>  You get paid for your work, but with a low dice result, you may get scammed.
> - Crime:
>   High risk-High reward version of jobs. 
>   Fines are high, but you can get 3x as much as with honest work.
> - Training to gain xp:
>   You hone your skills, be those martial or magical.
>   Rolling low may mean you hurt yourself or damage your weapon.
> **You get a new downtime action every ${DOWNTIME_RESET_TIME.DAY} at ${DOWNTIME_RESET_TIME.HOUR} after you play in your first game.**

> # Crafting items
> \`\`\`/westmarch item-downtime craft item: character:\`\`\`
> Not final.

> # Changing item properties
> \`\`\`/westmarch item-downtime change\`\`\`
> May not be implemented.`
,
`# For DMs:
> - Create a logbook entry at end of session:
> \`\`\`/westmarch logbook session: tier: xp: randomitem: ${currency}:\`\`\`
> \`session\` is the name of your session.
> \`tier\` will be the one that was advertised in your games' post, \`xp\` is the total the party earned.
> \`randomItem\` determines if the bot should generate a random item per player.
> You can also optionally use \`${currency}\` to reward each player that much ${currency}.
> 
> This command will create a discord user menu, select your players.
> You may need to type in their discord names before they show up, as discord only ever loads the first 25 entries.
> Now, you can select each players character. If they haven't registered it, ask them to do so and click "reload characters".
> You can also add notes if there is further information you'd like to record.
> After you click Publish, it will output the finished log to <#${GAME_LOG_CHANNEL}>.
> 
> Should you need to edit the log, you can react to the bots message with any emoji.
> This only works for the person that created the log.

> - Get a list of items with cost between two values
> \`\`\`/getitemsinrange minimum: maximum:\`\`\`
> This returns all items in that price range. There may be more items than fit in a discord message, so there is a button to send the next message until all items are displayed.

> - Get the items that can be found by players at a specific tier 
> \`\`\`/getitemsbytier tier:\`\`\`
> This returns all items of appropriate price. There may be more items than fit in a discord message, so there is a button to send the next message until all items are displayed.`
,
`**Should you encounter any problems with the bot, please notify <@367891183344812034>!**`
]

explanationMessage.forEach(message => {
    //console.log(message.length);
    if(message.length >= 2000) {
        throw new Error(`Message ${message.substring(0,15)} exceeds discord message length limit.`);
    }
});