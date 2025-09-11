import chalk from "chalk";

const l = console.log;
const server = "[zeroshare-server]";

function logMessage(
  message: string[],
  type: "info" | "error" | "success" = "info"
) {
  if (type === "info")
    l(chalk.yellow(server) + chalk.yellow(` ${message.join(" ")}`));
  else if (type === "error")
    l(chalk.red(server) + chalk.red(` ${message.join(" ")}`));
  else l(chalk.green(server) + chalk.green(` ${message.join(" ")}`));
}

export const log = {
  info: (...message: string[]) => logMessage(message, "info"),
  error: (...message: string[]) => logMessage(message, "error"),
  success: (...message: string[]) => logMessage(message, "success"),
};
