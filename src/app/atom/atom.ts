import { atomWithStorage } from 'jotai/utils';

export const commentsAtom = atomWithStorage<string[]>('comments', []);
