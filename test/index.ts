// Dependencies
import { GetContextCommand, GetCommand, InitialiseCommands, Commands} from "../lib/index.js";

// Vars
const CommandsPath = new URL("./commands", import.meta.url).pathname.substring(1)

//
;(async () => {
    // Init
    await InitialiseCommands(CommandsPath, CommandsPath, true)

    //
    const Ping = GetCommand(["test", "test2", "ping"])
    const Pong = GetCommand(["test", "pong"])
    const PingContext = GetContextCommand(["ping"])

    //
    console.log(PingContext)
})()