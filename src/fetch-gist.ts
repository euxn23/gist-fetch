import fetch from 'node-fetch';
import { GistDetail } from './types';

export async function fetchGist(
  username: string,
  filename: string
): Promise<string> {
  const userGists: GistDetail[] = await fetch(
    `https://api.github.com/users/${username}/gists`
  ).then(r => r.json());
  const gistUrl = getGistFileByName(userGists, filename);
  const gistText = await fetch(gistUrl).then(r => r.text());

  return gistText;
}

function getGistFileByName(gists: GistDetail[], filename: string): string {
  const files: string[] = gists.reduce(
    (prev, gist) => [
      ...prev,
      ...Object.keys(gist.files).reduce(
        (prev, key): string[] =>
          key === filename ? [...prev, gist.files[key].raw_url] : prev,
        [] as string[]
      )
    ],
    [] as string[]
  );
  if (!files.length) {
    throw new Error('file not found.');
  }
  if (files.length > 1) {
    console.warn(`WARN: some ${filename} exist on gist, so return first one.`);
  }

  return files[0];
}
