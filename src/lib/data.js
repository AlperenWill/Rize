import data from '../data/locations.json'

export const chapters = data.chapters
export const locations = data.locations
export const locationById = Object.fromEntries(locations.map((l) => [l.id, l]))
export const locationsOfChapter = (chapter) => locations.filter((l) => l.chapter === chapter)
