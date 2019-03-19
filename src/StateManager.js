import {tradeDeck, playerStarterDeck, eventDeck, freeAgentDeck} from './data/core-game';
import Deck from './models/Deck';
import {toast} from 'react-toastify';
import clone from 'clone';
import { NoEventCard } from './models/event-cards';

const PRESEASON_ROUNDS = 3;
const REGULAR_SEASON_ROUNDS = 10;
const POST_SEASON_WINS_REQUIRED = 4;

export default class StateManager{
    
    constructor(){
        const player1Squad = new Deck({});
        const player2Squad = new Deck({});
        
        const allCards = tradeDeck.cards
            .concat(clone(playerStarterDeck).cards)
            .concat(clone(playerStarterDeck).cards)
            .concat(clone(eventDeck).cards)
            .concat(clone(freeAgentDeck).cards);
        
        [player1Squad, player2Squad].forEach(deck => {
            const cards = [6, 5, 5, 4, 4, 4, 3, 3, 3].map(ability => {
                const card = tradeDeck.find(c => c.type === 'Player' && c.ability === ability);
                tradeDeck.remove(card);
                return card;
            });
            deck.add(cards);
            deck.add(freeAgentDeck.draw(4));
            deck.shuffle();
        });
        
        this.state = {
            allCards,
            view: 'hand',
            gameOver: false,
            round: 0,
            stage: 'Preseason',
            tradeDeck,
            tradeRow: tradeDeck.draw(10),
            availableIncome: 0,
            activeSubType: undefined,
            activeSubIndex: undefined,
            players: [
                createPlayer('Player 1', player1Squad),
                createPlayer('Player 2', player2Squad)                
            ],
            summary: [],
            activePlayer: 0,
            showSummary: false
        };
        this.calculateSquadRatings();

        console.log('Operations', tradeDeck.cards.filter(c => c.type === 'Operations').length);        
        console.log('Strategy', tradeDeck.cards.filter(c => c.type === 'Strategy').length);
        console.log('Player', tradeDeck.cards.filter(c => c.type === 'Player').length);                
    }
    
    viewHand(){
        this.state.view = 'hand';
    }
    
    viewSquad(){
        this.state.view = 'squad';
    }
    
    discard(cards){
        cards = Array.isArray(cards) ? cards : [cards];
        const player = this.getActivePlayer();
        player.hand = player.hand.filter(card => !cards.includes(card));
        player.activeHand = player.activeHand.filter(card => !cards.includes(card));        
        player.discardPile = player.discardPile.concat(cards.filter(x => x.type !== 'Player'));
    }
    
    draw(n = 1){
        const player = this.getActivePlayer();
        let cards = player.deck.draw(n);
        if(cards.length < n){
            player.deck = new Deck({cards: player.discardPile});
            player.deck.shuffle();
            player.discardPile = [];
            cards = cards.concat(player.deck.draw(n - cards.length));
        }
        player.hand = player.hand.concat(cards);
    }
    
    endTurn(){
        const player = this.getActivePlayer();
        player.previousHand = player.activeHand.concat();
        this.discard(player.activeHand);
        player.activeHand = [];
        if(this.state.stage !== 'Playoffs'){
            this.discard(player.hand);
            player.hand = [];
            this.draw(5);   
        }
        this.state.availableIncome = 0;
        this.state.activeSubType = undefined;
        this.state.activeSubIndex = undefined;
        this.state.activePlayer = this.state.activePlayer === 0 ? 1 : 0;        
        if(this.state.activePlayer === 0){
            this.state.round += 1;
            if(this.state.stage === 'Preseason' && this.state.round === PRESEASON_ROUNDS){
                this.state.stage = 'Regular Season';
                this.state.round = 0;
            }
            if(['Regular Season', 'Playoffs'].includes(this.state.stage) && this.state.round > 0){
                this.state.players[0].diceRoll = Math.floor(Math.random() * 6) + 1;                
                const p1 = this.state.players[0].totalRating + this.state.players[0].seasonBonus + this.state.players[0].diceRoll;
                this.state.players[0].finalRating = p1;
                this.state.players[1].diceRoll = Math.floor(Math.random() * 6) + 1;
                const p2 = this.state.players[1].totalRating + this.state.players[1].seasonBonus + this.state.players[1].diceRoll;
                this.state.players[1].finalRating = p2;
                if(p1 >= p2){
                    this.state.players[0].points += 1;
                }
                if(p2 >= p1){
                    this.state.players[1].points += 1;
                }
                this.state.summary = clone(this.state.players);
                this.state.showSummary = true;
            }
            if(this.state.stage === 'Regular Season' && this.state.round === REGULAR_SEASON_ROUNDS){
                this.state.tradeRow = [];
                this.state.players.forEach(p => {
                    p.deck.add(p.hand);
                    p.deck.add(p.discardPile);
                    p.hand = [];
                    p.discardPile = [];
                    p.deck = new Deck({cards: p.deck.cards.filter(c => c.type === 'Strategy')});
                    p.hand = p.deck.cards;
                    p.seasonBonus = p.points;
                    p.points = 0;
                });
                this.state.stage = 'Playoffs';
                this.state.round = 0;
            }
            if(this.state.stage === 'Playoffs' && (this.state.players[0].points === POST_SEASON_WINS_REQUIRED || this.state.players[1].points === POST_SEASON_WINS_REQUIRED)){
                this.state.gameOver = true;
                this.state.players.forEach(p => p.winner = p.points === POST_SEASON_WINS_REQUIRED);
            }
            
            this.state.players.forEach(p => {
                p.bonusMoney = 0;
                p.bonusEnergy = 0;
                p.previousHand = [];
                Object.values(p.starters)
                    .concat(Object.values(p.bench))
                    .concat(p.reserves).filter(c => c).forEach(c => {
                        c.injury = Math.max(c.injury - 1, 0);
                        c.suspension = Math.max(c.suspension - 1, 0);                        
                    });
            });
            
            const eventCard1 = eventDeck.drawSingle();
            this.applyEventCard(this.state.players[0], eventCard1);
            const eventCard2 = eventDeck.drawSingle();
            this.applyEventCard(this.state.players[1], eventCard2);
            eventDeck.add([eventCard1, eventCard2]);
            eventDeck.shuffle();
            
            this.calculateSquadRatings();
        }
        
        this.state.availableIncome = this.getActivePlayer().bonusMoney;
    }
    
    applyEventCard(player, card){
        player.eventCard = card;
        switch(card.type){
            case 'Injury': {
                const { playerType, playerIndex, length } = card;
                const target = player[playerType][playerIndex];
                if(!target || target.attributes.includes('Injury Resistent')) return;
                else if(target.attributes.includes('Injury Prone')) target.injury = length + 1;                
                else target.injury = length;
                return;
            }
            case 'Suspension': {
                const { playerType, playerIndex } = card;
                const target = player[playerType][playerIndex];
                if(!target) return;
                target.suspension = 1;
                return;
            }
            case 'Energy': {
                const { energy } = card;
                player.bonusEnergy = energy;
                return;
            }
            case 'Money': {
                const { money } = card;
                player.bonusMoney = money;
                return;
            }
        }
    }
    
    buy(card){
        if(this.state.availableIncome < card.cost){
            toast.warning('Not enough income.');
            return;
        }
        const player = this.getActivePlayer();
        const { tradeDeck, tradeRow } = this.state;
        this.state.tradeRow = tradeRow
            .filter(x => x !== card)
            .concat(tradeDeck.draw());
        this.state.availableIncome -= card.cost;
        if(card.type === 'Player'){
            player.reserves.push(card);
        }else{
            player.discardPile.push(card);
        }
    }
    
    play(card){
        const player = this.getActivePlayer();
        player.hand = player.hand.filter(x => x !== card);
        const { activeHand } = player;
        player.activeHand = activeHand.concat(card);
        
        for(let i = 0; i < card.draw; i++){
            this.draw();
        }
        
        if(card.income) this.state.availableIncome += card.income;
        
        if(card.type === 'Strategy'){
            this.applyStrategyCard(card);
            this.calculateSquadRatings();
        }

    }
    
    applyStrategyCard(card){
        const player = this.getActivePlayer();
        switch(card.strategyType){
            case 'RecoverFromInjury': {
                const injuries = getFullLineup(player).filter(c => c.injury > 0);
                if(injuries.length === 0) return;
                injuries.sort((a, b) => b.ability - a.ability);
                injuries[0].injury = 0;
                return;
            }
            case 'RescindSuspension': {
                const suspensions = getFullLineup(player).filter(c => c.suspension > 0);
                if(suspensions.length === 0) return;
                suspensions.sort((a, b) => b.ability - a.ability);
                suspensions[0].suspension = 0;
                return;
            }
            case 'Energy': {
                const { energy } = card;
                player.bonusEnergy += energy;
                return;
            }
        }
    }
    
    trade(){
        const { activeSubType, activeSubIndex } = this.state;
        const player = this.getActivePlayer();
        const card = player[activeSubType][activeSubIndex];
        if(!card) return;
        if( activeSubType === 'reserves'){
            player.reserves = player.reserves.filter(x => x !== card);
        }else{
            player[activeSubType][activeSubIndex] = undefined;   
        }
        const { activeHand } = player;
        player.activeHand = activeHand.concat(card);
        this.state.availableIncome += card.tradeValue;
        this.calculateSquadRatings(); 
        this.state.activeSubType = undefined;
        this.state.activeSubIndex = undefined;
    }
    
    sub(type, index){
        const { activeSubType, activeSubIndex } = this.state;
        
        if(activeSubType === type && activeSubIndex === index){
            this.state.activeSubType = undefined;
            this.state.activeSubIndex = undefined;
            return;
        }
        
        if(!activeSubType){
            this.state.activeSubType = type;
            this.state.activeSubIndex = index;
            return;
        }
        
        const player = this.getActivePlayer();
        
        const sub1 = player[activeSubType][activeSubIndex];
        const sub2 = player[type][index];
        
        if(!sub2 && activeSubType === 'reserves'){
            player.reserves = player.reserves.filter(x => x !== sub1);
        }else{
            player[activeSubType][activeSubIndex] = sub2;            
        }
        
        if(!sub1 && type === 'reserves'){
            player.reserves = player.reserves.filter(x => x !== sub2);
        }else{
            player[type][index] = sub1;            
        }
        
        this.state.activeSubType = undefined;        
        this.state.activeSubIndex = undefined;
        
        this.calculateSquadRatings();        
    }
    
    calculateSquadRatings(){
        this.state.players.forEach(player => {
            const starters = Object.values(player.starters).filter(x => x && x.injury === 0 && x.suspension === 0);
            const bench = Object.values(player.bench).filter(x => x && x.injury === 0 && x.suspension === 0);
            const lineup = starters.concat(bench);
            const team = lineup.concat(player.reserves.filter(x => x));
            
            Object.values(player.starters)
                .concat(Object.values(player.bench))
                .concat(player.reserves)
                .filter(x => x)
                .forEach(x => {
                    x.bonusAbility = 0;
                    x.bonusAttributes = [];
                });
            
            Object.keys(player.starters).forEach(pos => {
                const p = player.starters[pos];
                if(p && p.positions && !p.positions.includes(pos.toUpperCase())){
                    p.bonusAbility -= 2;
                }
            });
            
            Object.keys(player.bench).forEach(pos => {
                const p = player.bench[pos];
                if(p && p.positions && !p.positions.find(x => x.indexOf(pos.toUpperCase()) > -1)){
                    p.bonusAbility -= 1;
                }
            });
            
            lineup.forEach(x => {
                x.boosts.filter(boost => boost.attribute).forEach(boost => {
                    const match = starters.find(y => y.attributes.includes(boost.requires));
                    if(match) x.bonusAttributes = x.bonusAttributes.concat(boost.attribute);
                });
            });
                
            lineup.forEach(x => {
                x.boosts.filter(boost => boost.ability).forEach(boost => {
                    const match = starters.find(y => y.attributes.concat(y.bonusAttributes).includes(boost.requires));
                    if(match) x.bonusAbility += boost.ability;
                });
                player.activeHand.concat(player.previousHand).filter(card => card.type === 'Strategy').forEach(card => {
                    switch(card.strategyType){
                        case 'TypeBonus': {
                            if(x.attributes.concat(x.bonusAttributes).includes(card.attribute)){
                                x.bonusAbility += card.bonus;
                            }
                            return;
                        }
                    } 
                });
            });
            
            starters.forEach(x => {
                x.boosters.forEach(booster => {
                    const matches = lineup.filter(y => y.attributes.concat(y.bonusAttributes).includes(booster.attribute));
                    matches.forEach(y => y.bonusAbility += booster.ability);
                });
                x.bonusAbility += starters.find(y => y !== x && x.chemistry && y.chemistry === x.chemistry) ? 1 : 0;
            });
       
            player.activeHand.concat(player.previousHand).filter(card => card.type === 'Strategy').forEach(card => {
                switch(card.strategyType){
                    case 'BenchBonus': {
                        const bestSub = bench.sort((a, b) => b.ability - a.ability)[0];
                        bestSub.bonusAbility += bestSub.ability - bestSub.benchAbility;
                        return;
                    }
                    case 'StarterBonus': {
                        const bestStarter = starters.sort((a, b) => b.ability - a.ability)[0];
                        bestStarter.bonusAbility += bestStarter.benchAbility;
                        const worstSub = bench.sort((a, b) => a.ability - b.ability)[0];
                        worstSub.bonusAbility -= worstSub.benchAbility;
                        return;
                    }
                    case 'SinglePlayerTypeBonus': {
                        let target = starters.sort((a, b) => b.ability - a.ability)
                            .find(x => x.attributes.concat(x.bonusAttributes).includes(card.attribute));
                        if(target) {
                            target.bonusAbility += card.bonus;
                            return;
                        }
                        target = bench.sort((a, b) => b.ability - a.ability)
                            .find(x => x.attributes.concat(x.bonusAttributes).includes(card.attribute));
                        if(target) {
                            target.bonusAbility += card.bonus;
                        }
                        return;
                    }
                } 
            });
            
            let startersRating = 0;
            let benchRating = 0;
            
            starters.forEach(x => {
                if(!x || x.injury > 0 || x.suspension > 0) return;
                const rating = x.ability + x.bonusAbility;
                startersRating += rating;
            });
            
            bench.forEach(x => {
                if(!x || x.injury > 0 || x.suspension > 0) return;
                const rating = x.benchAbility + x.bonusAbility;                
                benchRating += rating;
            });
            
            player.startersRating = startersRating;
            player.benchRating = benchRating;
            player.squadRating = startersRating + benchRating;
            player.totalRating = player.squadRating + player.bonusEnergy;
        });
    }
    
    getActivePlayer(){
        return this.state.players[this.state.activePlayer];
    }
    
    hideSummary(){
        this.state.showSummary = false;
    }
    
}

function createPlayer(name, squadDeck){
    const cardDeck = clone(playerStarterDeck);
    cardDeck.shuffle();
    return {
        name,
        deck: cardDeck,
        hand: cardDeck.draw(5),
        discardPile: [],
        starters: {
            pg: squadDeck.drawSingle(),
            sg: squadDeck.drawSingle(),
            sf: squadDeck.drawSingle(),
            pf: squadDeck.drawSingle(),
            c: squadDeck.drawSingle(),                        
        },
        bench: {
            g: squadDeck.drawSingle(),                        
            f: squadDeck.drawSingle(),                        
            c: squadDeck.drawSingle(),                                                
        },
        reserves: squadDeck.cards,
        startersRating: 0,
        benchRating: 0,
        squadRating: 0,
        activeStrategy: [],
        points: 0,
        eventCard: new NoEventCard(),
        diceRoll: 0,
        totalRating: 0,
        finalRating: 0,
        winner: false,
        bonusMoney: 0,
        bonusEnergy: 0,
        activeHand: [],
        seasonBonus: 0,
        previousHand: []
    };
}

function getFullLineup(player){
    return Object.values(player.starters)
        .concat(Object.values(player.bench))
        .concat(player.reserves)
        .filter(p => !!p);
}