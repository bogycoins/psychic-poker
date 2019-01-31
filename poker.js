/*
#The Psychic Poker Player

##Sample Input

TH JH QC QD QS QH KH AH 2S 6S
2H 2S 3H 3S 3C 2D 3D 6C 9C TH
2H 2S 3H 3S 3C 2D 9C 3D 6C TH
2H AD 5H AC 7H AH 6H 9H 4H 3C
AC 2D 9C 3S KD 5S 4D KS AS 4C
KS AH 2H 3C 4H KC 2C TC 2D AS
AH 2C 9S AD 3C QH KS JS JD KD
6C 9C 8C 2D 7C 2H TC 4C 9S AH
3D 5S 2H QD TD 6S KH 9H AD QH
##Sample Output

Hand: TH JH QC QD QS Deck: QH KH AH 2S 6S Best hand: straight-flush
Hand: 2H 2S 3H 3S 3C Deck: 2D 3D 6C 9C TH Best hand: four-of-a-kind
Hand: 2H 2S 3H 3S 3C Deck: 2D 9C 3D 6C TH Best hand: full-house
Hand: 2H AD 5H AC 7H Deck: AH 6H 9H 4H 3C Best hand: flush
Hand: AC 2D 9C 3S KD Deck: 5S 4D KS AS 4C Best hand: straight
Hand: KS AH 2H 3C 4H Deck: KC 2C TC 2D AS Best hand: three-of-a-kind
Hand: AH 2C 9S AD 3C Deck: QH KS JS JD KD Best hand: two-pairs
Hand: 6C 9C 8C 2D 7C Deck: 2H TC 4C 9S AH Best hand: one-pair
Hand: 3D 5S 2H QD TD Deck: 6S KH 9H AD QH Best hand: highest-card

*/

const cardRanks = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

const handRanks = {
    'straight-flush': 9,
    'four-of-a-kind': 8,
    'full-house': 7,
    'flush': 6,
    'straight': 5,
    'three-of-a-kind': 4,
    'two-pairs': 3,
    'one-pair': 2,
    'highest-card': 1,
};

function sortByCard(x, y) {
    const cardARank = cardRanks[x[0]];
    const cardBRank = cardRanks[y[0]];

    return cardARank < cardBRank ? -1 : cardARank > cardBRank ? 1 : 0;
}

function sortByCardAceFirst(x, y) {
    const cardARank = x[0] === 'A' ? 1 : cardRanks[x[0]];
    const cardBRank = y[0] === 'A' ? 1 : cardRanks[y[0]];

    return cardARank < cardBRank ? -1 : cardARank > cardBRank ? 1 : 0;
}

let countCards = function (hand) {
    let result = {};

    hand.forEach(function (rawCard) {
        let card = rawCard[0];

        if (!result[card]) {
            result[card] = 0;
        }
        result[card]++;
    });
    return result;
};

function isTwoPairs(hand) {
    let temp = countCards(hand);
    let pairsArr = [];

    for (let card in temp) {
        if (temp[card] === 2) {
            pairsArr.push(card);
        }
    }

    if (pairsArr.length === 2) {
        return true;
    }
}

function isStraight(hand) {
    function checkStraight(card, index) {
        const currentCard = cardRanks[card[0]];
        const aceAsOne = currentCard === 14;
        const nextCard = hand[index + 1] ? cardRanks[hand[index + 1][0]] : undefined;
        return index === hand.length - 1 || (currentCard < nextCard && nextCard === currentCard + 1) || (aceAsOne ? nextCard === 2 : false);
    }

    return hand.sort(sortByCard).every(checkStraight) || hand.sort(sortByCardAceFirst).every(checkStraight);
}

function isFlush(hand) {
    return hand.every(card => card[1] === hand[0][1]);
}

function isFullHouse(hand) {
    return isNOfAKind(hand, 2) && isNOfAKind(hand, 3);
}

function isNOfAKind(hand, n) {
    let temp = countCards(hand);

    for (let card in temp) {
        if (temp[card] === n) {
            return true;
        }
    }
}

function isStraightFlush(hand) {
    if (isStraight(hand) && isFlush(hand)) {
        return true;
    }
}

function handRank(hand) {
    if (isStraightFlush(hand)) {
        return 'straight-flush';
    }
    if (isNOfAKind(hand, 4)) {
        return 'four-of-a-kind';
    }
    if (isFullHouse(hand)) {
        return 'full-house';
    }
    if (isFlush(hand)) {
        return 'flush';
    }
    if (isStraight(hand)) {
        return 'straight';
    }
    if (isNOfAKind(hand, 3)) {
        return 'three-of-a-kind';
    }
    if (isTwoPairs(hand)) {
        return 'two-pairs';
    }
    if (isNOfAKind(hand, 2)) {
        return 'one-pair';
    }

    return 'highest-card';
}

let keepInHand = [];
let bestScore = 0;

function dropCards(input, length, start, cardsInDeck) {
    if (length === 0) {
        let cardsToDraw = cardsInDeck.slice(0, cardsInDeck.length - keepInHand.length);
        let currentHand = cardsToDraw.concat(keepInHand);
        let rankScore = handRanks[handRank(currentHand)];
        bestScore = rankScore > bestScore ? rankScore : bestScore;
        return;
    }

    for (let i = start; i < input.length; i++) {
        keepInHand[keepInHand.length - length] = input[i];
        dropCards(input, length - 1, i + 1, cardsInDeck);
    }
}

function switchCards(hand, deck) {
    for (let i = 0; i <= 5; i++) {
        keepInHand.length = i;
        dropCards(hand, keepInHand.length, 0, deck);
    }
}

function findBestHand(input) {
    const hand = input.slice(0, 5);
    const deck = input.slice(5);
    bestScore = 0;

    switchCards(hand, deck);
    console.log('Hand:', hand.toString().replace(/,/g, ' '), 'Deck:', deck.toString().replace(/,/g, ' '), 'Best hand:', Object.keys(handRanks).find(key => handRanks[key] === bestScore));
}

let fs = require('fs');
let input = 'input.txt';
if (process.argv.slice(2).length) {
    input = process.argv.slice(2)[0];
}

fs.readFile(input, 'utf8', function (err, contents) {
    contents.split('\n').forEach(entry => findBestHand(entry.split(' ')));
});
