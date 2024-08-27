import { DOWNTIME_RESET_TIME, GAME_LOG_CHANNEL } from "./utils.js";

export const explanationMessage = [
`# The Trader Bot
I, <@1263837871966785567>, will help you with many westmarch activities on the server.
> # Register characters
> I will need to know your characters name, so you should add them:
> - You can register them via
> \`\`\`/westmarch character register name:\`\`\`
> - You can remove a character using
> \`\`\`/westmarch character unregister name:\`\`\`
> - You can see your registered characters via
> \`\`\`/westmarch character show\`\`\`
> You can have a maximum of **ten** characters registered with the bot.
> If a character is not registered, but is used in a command, it will automatically ask if you want to register the character.

> # Buying / Selling items
> \`\`\`/westmarch buy item: character: amount:\`\`\` 
> or 
> \`\`\`/westmarch sell item: character: amount:\`\`\`
> I require the options \`item\` and \`character\` to know who's buying what.
> Optionally, you can buy multiple of the same item at once with the option \`amount\`
> Before the transaction happens, the price of the item is displayed in a message. 
> You can ignore the message, or confirm the transaction by clicking the button at the bottom.

> # Downtimes
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
`\n# For DMs:
> - Get reward items and gold at end of a game:
> \`\`\`/westmarch reward tier: xp: reward:\`\`\`
> \`tier\` will be the one that was advertised in your games' post, \`xp\` is the total the party earned.
> You can also optionally select to pay out gold instead of an item with \`reward\`
> This will create a discord user menu, select your players.
> After choosing, it will output the xp per player, and an item + gold per player.
> This can be used as the template for your session log, just copy paste it to <#${GAME_LOG_CHANNEL}> and change any details necessary. 
> <@number> will turn into a user mention when the message is copied, this is intended.

> - Get a list of items with cost between two values
> \`\`\`/getitemsinrange minimum: maximum:\`\`\`
> This returns all items in that price range. There may be more items than fit in a discord message, so there is a button to send the next message until all items are displayed.`
,
`**Should you encounter any problems with the bot, please notify <@367891183344812034>!**`]