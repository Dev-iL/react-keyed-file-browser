import { compareAsc, compareDesc } from 'date-fns';
import { SortDirection } from '.';

function lastModifiedSort(allFiles, direction = SortDirection.ASCENDING) {
  const folders = [];
  let files = [];
  for (let fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    const file = allFiles[fileIndex];
    const keyFolders = (file.newKey || file.key).split('/');
    if (file.children) {
      folders.push(file);
    } else {
      file.name = keyFolders[keyFolders.length - 1];
      files.push(file);
    }
  }

  // Sort files based on direction
  if (direction === SortDirection.ASCENDING) {
    files = files.sort(compareAsc);
  } else {
    files = files.sort(compareDesc);
  }

  for (let folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    const folder = folders[folderIndex];
    folder.children = lastModifiedSort(folder.children, direction);
  }

  let sortedFiles = [];
  sortedFiles = sortedFiles.concat(folders);
  sortedFiles = sortedFiles.concat(files);
  return sortedFiles;
}

export default function(files, direction) {
  return lastModifiedSort(files, direction);
}
