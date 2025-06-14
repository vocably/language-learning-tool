import { readFileSync, writeFileSync } from 'fs';

const deck = JSON.parse(readFileSync('deck-as-is.json'));

for (let card of deck.cards) {
  if (!card.data.partOfSpeech) {
    card.data.partOfSpeech = '';
  }
}

writeFileSync('deck-fixed.json', JSON.stringify(deck));
