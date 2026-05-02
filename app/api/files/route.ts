import fs from "fs";
import path from "path";

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");

  const getFiles = (folder: string) => {
    const dirPath = path.join(publicDir, folder);
    return fs.readdirSync(dirPath).map((file) => `/${folder}/${file}`);
  };

  return Response.json({
    images: getFiles("images"),
    icons: getFiles("icons"),
  });
}
