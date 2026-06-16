import { db } from "./src/config/database.js";
import { getProfile } from "./src/modules/users/users.service.js";
import * as fs from "fs";

async function main() {
  let logContent = "";
  try {
    logContent += "Attempting to fetch first user from database...\n";
    const user = await db.user.findFirst();
    if (!user) {
      logContent += "No users found in database.\n";
    } else {
      logContent += `Found user ID: ${user.id}, Email: ${user.email}\n`;
      logContent += "Calling usersService.getProfile...\n";
      const profile = await getProfile(user.id);
      logContent += `Successfully fetched profile. Business Name: ${profile.vendor?.businessName || 'None'}\n`;
    }
  } catch (err: any) {
    logContent += `Error caught:\nName: ${err?.name}\nMessage: ${err?.message}\nStack: ${err?.stack}\n`;
  } finally {
    fs.writeFileSync("db_error.txt", logContent);
    await db.$disconnect();
  }
}

main();
