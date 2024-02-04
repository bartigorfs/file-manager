let currentDirectoryPath;

export const getCurrentDirectory = () => {
    return currentDirectoryPath;
}

export const setCurrentDirectory = (path) => {
    currentDirectoryPath = path;
}