import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../interfaces";
import UniversalExecutor, { ConnectionError } from "../universalExecutor";
import { CommandInteraction } from "discord.js";
import npmlog from "npmlog";
import { hasAdministratorPermission } from "../util/permissions";

export class DisconnectCommand implements DiscordCommand {
  data = new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect this channel from Revolt");

  async execute(interaction: CommandInteraction, executor: UniversalExecutor) {
    // Permission check
    if (hasAdministratorPermission(interaction.memberPermissions)) {
      try {
        await executor.disconnect("discord", interaction.channelId);
        await interaction.reply("Channel disconnected successfully.");
      } catch (e) {
        if (e instanceof ConnectionError) {
          await interaction.reply("Error! " + e.message);
        } else {
          await interaction.reply("Something went very wrong. Check the logs.");
          npmlog.error("Discord", "An error occurred while disconnecting channels");
          npmlog.error("Discord", e);
        }
      }
    } else {
      await interaction.reply("Error! You don't have enough permissions.");
    }
  }
}
