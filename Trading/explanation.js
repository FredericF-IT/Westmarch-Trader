import { GAME_LOG_CHANNEL } from "./utils.js";

export const explanationMessage = [
`**The Trader Bot**
I, <@1263837871966785567>, will help you with many westmarch activities on the server.
> I will need to know your characters, so you should add them:
> - You can register them via
> \`/westmarch character register name:<your characters name>\`
> - You can remove a character using
> \`/westmarch character unregister name:<your characters name>\`
> - You can see your registered characters via
> \`/westmarch character show\`
> You can have a maximum of **ten **characters registered with the bot.
> If a character is not registered, but is used in a command, it will automatically ask if you want to register the character.

> You can buy and sell items using
> \`/westmarch buy\` or \`/westmarch sell\`
> I require the options \`item:<item name>\` and \`character:<your characters name>\`
> Optionally, you can buy multiple of the same item at once with the option
> \`amount:<how many of the item>\`
> Before the transaction happens, the price of the item is displayed in a message. 
> You can ignore the message, or confirm the transaction by clicking the button at the bottom.

> You can do downtimes using
> \`/westmarch downtime activity:<the activity> character:<your characters name> level:<your characters level>\`
> There are currently three options. More may be added later.
> - Doing a job:
>  You get paid for your work, but with a low dice result, you may get scammed.
> - Crime:
>   High risk-High reward version of jobs. 
>   Fines are high, but you can get 3x as much as with honest work.
> - Training to gain xp:
>   You hone your skills, be those martial or magical.
>   Rolling low may mean you hurt yourself or damage your weapon.

> Crafting items:
> \`/westmarch item-downtime craft item:<item name> character:<your characters name>\`
> Not final.

> Changing item properties:
> \`/westmarch item-downtime change\`
> May not be implemented.`
,
`For DMs:
> - Get reward items and gold at end of a game:
> \`/westmarch reward tier:<player tier> xp:<the combined xp the party receives>\`
> This will create a discord user menu, select your players.
> After choosing, it will output the xp per player, and an item + gold per player.
> This can be used as the template for your session log, just copy paste it to <#${GAME_LOG_CHANNEL}> and change any details necessary. 
> <@number> will turn into a user mention when the message is copied, this is intended.

> - Get a list of items with cost between two values
> \`/getitemsinrange minimum:<lowest price the item can have> maximum:<highest price the item can have>\`
> This returns all items in that price range. There may be more items than fit in a discord message, so there is a button to send the next message until all items are displayed.`
,
`**Should you encounter any problems with the bot, please notify <@367891183344812034>!**`]