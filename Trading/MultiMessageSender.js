// @ts-check
/**
 * @typedef {import("./types.js").interaction} interaction
 * @typedef {import("discord.js").TextChannel} TextChannel
 * @typedef {import("discord.js").ActionRow} ActionRow
 */

import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { errorResponse, responseMessage } from "./utils.js";

const ID = "multipage";
export class MultiMessageSender {
  /** @type {Map<string, string[]>} */
  static #memory = new Map();

  static getID() { return ID; }

  /**
   * Partition array of strings into messages that do not exceed character limit, then send.
   * @param {string[]} lines 
   * @param {interaction} interaction
   * @param {boolean} ephemeral 
   * @param {string} lineSeperator 
   * @param {string} messageSeperator 
   */
  static sendLongMessage(lines, interaction, ephemeral, lineSeperator, messageSeperator){ 
    /** @type {string[]} */
    const sections = [lines.shift() || ""];
    const maxLength = 2000 - lineSeperator.length - messageSeperator.length;

    var i = 0;
    lines.forEach((line) => {
      if(sections[i].length + line.length >= maxLength) {
        sections[i] += messageSeperator;
        i++;
        sections[i] = messageSeperator + line;
        return;
      }
      sections[i] += lineSeperator + line;
    });

    this.sendLongMessagePartitioned(sections, interaction, ephemeral);
  }

  /**
   * Sends messages assuming sections contains no string longer than 2000 chars
   * @param {string[]} sections 
   * @param {interaction} interaction
   * @param {boolean} ephemeral 
   */
  static sendLongMessagePartitioned(sections, interaction, ephemeral){
    // no need to remember, as we can send all at once
    if(!ephemeral) {
      interaction.reply(responseMessage(sections[0], false));
      /** @ts-ignore @type {TextChannel} */
      const textChannel = interaction.channel;
      for(let j = 1; j < sections.length; j++) {
        setTimeout(() => {
          textChannel.send(sections[j]);
        }, 500 * j);
      }
      return;
    }

    const id = interaction.id;

    this.#memory.set(id, sections);

    const minutesTillDeletion = 5;
    setTimeout(
      () => {
        this.#memory.delete(id);
      }, 1000 * 60 * minutesTillDeletion);

    this.#sendMessage(interaction, sections, 0, id);
  }

  /**
   * @param {interaction} interaction 
   * @param {string[]} sections 
   * @param {number} page 
   * @param {string} id 
   */
  static #sendMessage(interaction, sections, page, id) {
    var components = undefined;
    if(page + 1 < sections.length) {
      components = [this.#nextPageButton(id, page + 1)];
    }

    return interaction.reply({
      content: sections[page],
      ephemeral: true,
      components: components,
    });
  }

  /**
   * @param {interaction} interaction
   */
  static nextPage(interaction) {
    const parts = interaction.customId.split("_");
    const page = parseInt(parts[1]);
    const id = parts[2];
    console.log(parts);
    const section = this.#memory.get(id);
    if(!section) {
      return interaction.reply(errorResponse("Content expired. Please retype command."));
    } else if(section.length <= page) {
      return interaction.reply(errorResponse("Last page reached already."));
    }
    
    return this.#sendMessage(interaction, section, page, id);
  }

  /**
   * @param {string} id 
   * @param {number} nextPage 
   * @return {ActionRow}
   */
  static #nextPageButton(id, nextPage) {
    /** @ts-ignore */
    return {
      type: MessageComponentTypes.ACTION_ROW.valueOf(),
      components: [
        {
            type: MessageComponentTypes.BUTTON.valueOf(),
            custom_id: `${ID}_${nextPage}_${id}`,
            label: "Next Page",
            style: ButtonStyleTypes.PRIMARY.valueOf(),
        },
      ],
    };
  }
}