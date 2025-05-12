import { MessageComponentTypes, ButtonStyleTypes } from "discord-interactions";
import { TextChannel } from "discord.js";
import { isAdmin } from "./extraUtils.js";
import { currency, DOWNTIME_LOG_CHANNEL, DOWNTIME_RESET_TIME, errorResponse, GAME_LOG_CHANNEL, getChannel, responseMessage, TRANSACTION_LOG_CHANNEL } from "./utils.js";
import 'dotenv/config';

/** 
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").DMChannel} DMChannel 
*/

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
> You can ignore the message, or accept the transaction by clicking the confirmation button.
> 
> Item prices are rolled using dice, each rarity has its own range. 
> The prices are reset at the same time as the downtimes. Using the buying command will roll the new price.`
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

> # Downtime history
> Did you forget to add a downtime to your log, or accidentally deleted the message containing them all?
> You can now get a summary of all your future downtimes via
> \`\`\`/westmarch downtimehistory character:\`\`\``
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

/**
 * Sends the command explanation as mutliple messages.
 * @param {interaction} interaction
 * @param {Client} client
 * @param {string} channelID
 * @param {User?} user
 * @param {boolean} isDirectMessage
 */
export async function explainMe(interaction, client, channelID, user, isDirectMessage) {
  if (!isDirectMessage && !isAdmin(interaction.member)) {
    const response = errorResponse("You do not have permission to post this on a server.\nI can send it to you as a dm.");
    response.components = [
      {
        type: MessageComponentTypes.ACTION_ROW.valueOf(),
        components: [
          {
            type: MessageComponentTypes.BUTTON.valueOf(),
            // @ts-ignore
            custom_id: `dmExplanation`,
            label: "Send in DM",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
          },
        ],
      },
    ];
    return interaction.reply(response);
  }

  if (isDirectMessage) {
    updateExplainMe(user ? user.dmChannel : null);
  } else {
    let channel = await getChannel(channelID).then();
    if (!(channel instanceof TextChannel)) {
      return interaction.reply(errorResponse("This channel is not a text channel."));
    }
    updateExplainMe(channel);
  }
  interaction.reply(responseMessage("Explanation sent", true));
}

/**
 * Updates bots messages to the current command explanation.
 * @param {TextChannel | DMChannel | null} channel
 * @return {responseObject}
 */
async function updateExplainMe(channel) {
  if (!channel) {
    return errorResponse("Channel not found");
  } 

  /** @type {Map<string, Message>}*/ 
  const messages = await channel.messages.fetch({ limit: 100 }).then();
  const neededMessages = explanationMessage.length;
  let j = 0;

  for (let message of messages.entries()) {
    if (message[1].author.id !== process.env.APP_ID) {
      messages.delete(message[0]);
    } else if (j >= neededMessages) {
      messages.delete(message[0]);
      message[1].delete();
    } else {
      j++;
    }
  }

  const existingMessages = messages.size;
  let updateWait = 0;
  // sends as many new messages as needed
  // j is the first index of text that doesnt have a message
  for (let j = existingMessages; j < neededMessages; j++) {
    setTimeout(() => {
      channel.send({ content: explanationMessage[j] });
    }, 500 * updateWait++);
  }

  // discord returns messages in reversed order.
  // we start at the last message that was already sent and 
  // update it with the corresponding text section
  let i = existingMessages - 1;
  messages.forEach(message => {
    if (i < 0) return;
    setTimeout((number) => {
      if (message.content !== explanationMessage[number]) {
        message.edit(explanationMessage[number]);
        console.log("Updated an explanation message.");
      }
    }, 500 * updateWait++, i);
    i--;
  });
}
