import { SortByDefault, SortDirection } from '.';

function naturalDraftComparer(a, b) {
  if (a.draft && !b.draft) {
    return 1;
  } else if (b.draft && !a.draft) {
    return -1;
  }
  return SortByDefault(a, b);
}

function SortByName(allFiles, direction = SortDirection.ASCENDING) {
  let folders = [];
  let files = [];

  for (let fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    const file = allFiles[fileIndex];
    const keyFolders = (file.newKey || file.key).split('/');
    if (file.children) {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 2];
      }
      folders.push(file);
    } else {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 1];
      }
      files.push(file);
    }
  }

  // Sort files based on direction
  if (direction === SortDirection.ASCENDING) {
    files = files.sort(SortByDefault);
  } else {
    // Sort files in descending order
    files = files.sort((a, b) => SortByDefault(b, a));
  }
  
  // Sort folders based on draft status and natural order
  folders = folders.sort(naturalDraftComparer);

  for (let folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    const folder = folders[folderIndex];
    folder.children = SortByName(folder.children, direction);
  }

  let sortedFiles = [];
  sortedFiles = sortedFiles.concat(folders);
  sortedFiles = sortedFiles.concat(files);
  return sortedFiles;
}

export default function(files, direction) {
  return SortByName(files, direction);
}
