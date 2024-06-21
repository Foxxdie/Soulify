export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Get all files in the soul directory so that we can initialize a new soul.
 * This has to be a server action so that we have access to the file system.
 * @returns 
 */
export async function GET() {
  const soulDirPath = './daedalus/soul'; // Adjust path if needed
  try {
    const readFilesRecursive = (dirPath: string): { relativePath: string; content: string }[] => {
      const files: { relativePath: string; content: string }[] = [];

      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join('soul', path.relative(soulDirPath, fullPath)).replace(/\\/g, '/');

        if (entry.isDirectory()) {
          files.push(...readFilesRecursive(fullPath));
        } else {
          const content = fs.readFileSync(fullPath, 'utf-8');
          files.push({ relativePath, content });
        }
      }

      return files;
    };

    const filesToRead = readFilesRecursive(soulDirPath);

    // additionally grab package.json since it's outside the soul directory
    const packageJsonPath = path.join(soulDirPath, '../package.json'); 
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      filesToRead.push({ relativePath: 'package.json', content: packageJsonContent });
    } else {
      console.warn('package.json not found at:', packageJsonPath);
    }

    return NextResponse.json(filesToRead); 
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json({ error: 'Error reading files' }, { status: 500 });
  }
}