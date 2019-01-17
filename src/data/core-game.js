import Deck from '../models/Deck';
import OperationsCard from '../models/OperationsCard';
import PlayerCard from '../models/PlayerCard';
import StrategyCard from '../models/StrategyCard';
import {InjuryEventCard, SuspensionEventCard, EnergyEventCard, MoneyEventCard, NoEventCard} from '../models/event-cards';
import { RecoverFromInjuryStrategyCard, RescindSuspensionStrategyCard,
    EnergyStrategyCard, PlayerTypeBonusStrategyCard, BenchBonusStrategyCard,
    StarterBonusStrategyCard, SinglePlayerTypeBonusStrategyCard} from '../models/strategy-cards';
import clone from 'clone';

const operationsCards = []
    .concat(duplicate(new OperationsCard({ name: 'Hot Dog Stand', cost: 2, income: 2}), 6))
    .concat(duplicate(new OperationsCard({ name: 'Mascot', cost: 2, income: 2}), 4))
    .concat(duplicate(new OperationsCard({ name: 'Burger Bar', cost: 3, income: 3}), 6))    
    .concat(duplicate(new OperationsCard({ name: 'Cheerleaders', cost: 3, income: 2, draw: 1}), 4))
    .concat(duplicate(new OperationsCard({ name: 'Stadium Tours', cost: 3, income: 3}), 8))
    .concat(duplicate(new OperationsCard({ name: 'Cafe', cost: 3, income: 2, draw: 1}), 8))        
    .concat(duplicate(new OperationsCard({ name: 'Bar', cost: 4, income: 4}), 6))
    .concat(duplicate(new OperationsCard({ name: 'Restaurant', cost: 4, income: 4, draw: 1}), 6))    
    .concat(duplicate(new OperationsCard({ name: 'Merchandise Stand', cost: 4, income: 3, draw: 2}), 6))    
    .concat(duplicate(new OperationsCard({ name: 'VIP Boxes', cost: 5, income: 5}), 4))
    .concat(duplicate(new OperationsCard({ name: 'Superstore', cost: 6, income: 5, draw: 1}), 4));
    
const strategyCards = []
    .concat(duplicate(new RecoverFromInjuryStrategyCard({cost: 5}), 3))
    .concat(duplicate(new RescindSuspensionStrategyCard({cost: 3}), 3))
    .concat(duplicate(new EnergyStrategyCard({cost: 2, name: 'Day Off', description: '', energy: 1}), 2))    
    .concat(duplicate(new EnergyStrategyCard({cost: 3, name: 'Motivational Speech', description: '', energy: 2}), 2))
    .concat(duplicate(new EnergyStrategyCard({cost: 5, name: 'Boot Camp', description: '', energy: 3}), 2))
    .concat(duplicate(new EnergyStrategyCard({cost: 4, name: 'Fitness Training', description: '', energy: 2}), 2))    
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 5, name: 'Shooting Training', description: 'Shooters', attribute: 'Shooter', bonus: 1}), 2))
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 5, name: 'Defending Training', description: 'Defenders', attribute: 'Defender', bonus: 1}), 2))
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 6, name: 'Scoring Training', description: 'Scorers', attribute: 'Scorer', bonus: 1}), 2))
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 5, name: 'Rebounding Training', description: 'Rebounders', attribute: 'Rebounder', bonus: 1}), 2))
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 4, name: 'Passing Training', description: 'Passers', attribute: 'Passer', bonus: 1}), 1))
    .concat(duplicate(new PlayerTypeBonusStrategyCard({cost: 5, name: 'Youth Coach', description: 'Rookies', attribute: 'Rookie', bonus: 1}), 2))
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 2, name: 'Glory Days', description: '1 Veteran', attribute: 'Veteran', bonus: 1}), 2))    
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 4, name: 'Shooting 1 on 1', description: '1 Shooter', attribute: 'Shooter', bonus: 1}), 2))
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 3, name: 'Defending 1 on 1', description: '1 Defender', attribute: 'Defender', bonus: 1}), 2))
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 4, name: 'Scoring 1 on 1', description: '1 Scorer', attribute: 'Scorer', bonus: 1}), 2))
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 3, name: 'Rebounding 1 on 1', description: '1 Rebounder', attribute: 'Rebounder', bonus: 1}), 1))
    .concat(duplicate(new SinglePlayerTypeBonusStrategyCard({cost: 3, name: 'Passing 1 on 1', description: '1 Passer', attribute: 'Passer', bonus: 1}), 2))    
    .concat(duplicate(new BenchBonusStrategyCard({cost: 5}), 2))
    .concat(duplicate(new StarterBonusStrategyCard({cost: 6}), 2));
    
const playerCards = [
    new PlayerCard({name: 'Steph Curry', cost: 8, ability: 8, positions: ['PG'], attributes: ['Shooter'], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'Kyrie Irving', cost: 7, ability: 7, positions: ['PG'], attributes: ['Shooter', 'Scorer', 'Clutch'], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'Russell Westbrook', cost: 7, ability: 7, positions: ['PG'], attributes: ['Rebounder', 'Passer'], boosts: [], boosters: [{attribute: 'Scorer', ability: 1}], description: "All Scorers get +1 ability", chemistry: 3}),
    new PlayerCard({name: 'Damian Lilliard', cost: 7, ability: 7, positions: ['PG'], attributes: ['Shooter', 'Clutch'], boosts: [], boosters: [], chemistry: 4}),
    new PlayerCard({name: 'John Wall', cost: 6, ability: 6, positions: ['PG'], attributes: ['Passer'], boosts: [{requires: 'Defender', attribute: 'Scorer'}], boosters: [], description: "Gains Scorer attribute if playing with a Defender", chemistry: 5}),    
    new PlayerCard({name: 'Chris Paul', cost: 6, ability: 6, positions: ['PG'], attributes: ['Passer', 'Veteran'], boosts: [], boosters: [], chemistry: 3}),        
    new PlayerCard({name: 'Kemba Walker', cost: 6, ability: 6, positions: ['PG'], attributes: ['Scorer'], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'Kyle Lowry', cost: 5, ability: 5, positions: ['PG'], attributes: ['Passer'], boosts: [], boosters: [{attribute: 'Shooter', ability: 1}], description: "All Shooters get +1 ability", chemistry: 5}),
    new PlayerCard({name: 'Ben Simmons', cost: 4, ability: 4, positions: ['PG', 'PF'], attributes: ['Defender'], boosts: [{requires: 'Shooter', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Shooter", chemistry: 4}),    
    new PlayerCard({name: 'Rojan Rando', cost: 4, ability: 4, positions: ['PG'], attributes: ['Veteran', 'Passer'], boosts: [], boosters: [], chemistry: 5}),
    new PlayerCard({name: 'Derek Rose', cost: 4, ability: 4, positions: ['PG', 'SG'], attributes: ['Veteran', 'Scorer'], boosts: [{requires: 'Defender', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Defender", chemistry: 4}),    
    new PlayerCard({name: 'DeAaron Fox', cost: 4, ability: 4, positions: ['PG'], attributes: ['Rookie'], boosts: [{requires: 'Veteran', attribute: 'Scorer'}], boosters: [], description: "Gains Scorer attribute if playing with a Veteran", chemistry: 2}),        
    new PlayerCard({name: 'Lonzo Ball', cost: 3, ability: 3, positions: ['PG'], attributes: ['Rookie', 'Passer'], boosts: [{requires: 'Veteran', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Veteran", chemistry: 5}),    
    new PlayerCard({name: 'Trae Young', cost: 3, ability: 3, positions: ['PG'], attributes: ['Rookie', 'Shooter'], boosts: [], boosters: [], chemistry: 1}),        
    
    new PlayerCard({name: 'James Harden', cost: 8, ability: 8, positions: ['SG', 'PG'], attributes: ['Shooter', 'Scorer', 'Passer'], boosts: [], boosters: [{attribute: 'Scorer', ability: 1}], description: "All Scorers get +1 ability", chemistry: 3}),    
    new PlayerCard({name: 'Klay Thompson', cost: 7, ability: 7, positions: ['SG'], attributes: ['Shooter'], boosts: [{requires: 'Passer', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Passer", chemistry: 1}),
    new PlayerCard({name: 'Victor Oladipo', cost: 7, ability: 7, positions: ['SG'], attributes: ['Defender', 'Shooter'], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'DeMar DeRozen', cost: 6, ability: 6, positions: ['SG'], attributes: ['Scorer', 'Passer'], boosts: [{requires: 'Shooter', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Shooter", chemistry: 2}),
    new PlayerCard({name: 'CJ McCollum', cost: 6, ability: 6, positions: ['SG'], attributes: ['Shooter'], boosts: [], boosters: [], chemistry: 4}),    
    new PlayerCard({name: 'Bradley Beale', cost: 6, ability: 6, positions: ['SG'], attributes: ['Shooter'], boosts: [], boosters: [], chemistry: 5}),
    new PlayerCard({name: 'Donavon Mitchell', cost: 5, ability: 5, positions: ['SG'], attributes: ['Rookie'], boosts: [{requires: 'Passer', attribute: 'Scorer'}], boosters: [], description: "Gains Scorer attribute if playing with a Passer", chemistry: 3}),
    new PlayerCard({name: 'Devon Booker', cost: 5, ability: 5, positions: ['SG'], attributes: ['Scorer'], boosts: [], boosters: [], chemistry: 1}),
    new PlayerCard({name: 'Jaylen Brown', cost: 5, ability: 5, positions: ['SG', 'SF'], attributes: ['Scorer'], boosts: [{requires: 'Defender', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Defender", chemistry: 2}),    
    new PlayerCard({name: 'Patrick Beverley', cost: 4, ability: 4, positions: ['SG'], attributes: ['Defender'], boosts: [], boosters: [], chemistry: 3}),    
    new PlayerCard({name: 'JJ Reddick', cost: 4, ability: 4, positions: ['SG'], attributes: ['Shooter'], boosts: [], boosters: [], chemistry: 4}),        
    new PlayerCard({name: 'Dwayne Wade', cost: 4, ability: 4, positions: ['SG'], attributes: ['Veteran', 'Scorer', 'Clutch'], boosts: [], boosters: [{attribute: 'Rookie', ability: 1}], description: "All Rookies get +1 ability", chemistry: 5}),    
    new PlayerCard({name: 'Zach Lavine', cost: 3, ability: 3, positions: ['SG'], attributes: [], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'Lou Williams', cost: 3, ability: 3, positions: ['SG'], attributes: ['Veteran', 'Clutch'], boosts: [], boosters: [], chemistry: 2}),            

    new PlayerCard({name: 'Lebron James', cost: 9, ability: 9, positions: ['SF', 'PG'], attributes: ['Scorer', 'Passer', 'Clutch', 'Veteran'], boosts: [], boosters: [{attribute: 'Shooter', ability: 1}], description: "All Shooters get +1 ability", chemistry: 5}),        
    new PlayerCard({name: 'Kawhi Leonard', cost: 8, ability: 8, positions: ['SF'], attributes: ['Defender', 'Scorer'], boosts: [], boosters: [], chemistry: 3}),    
    new PlayerCard({name: 'Jimmy Bulter', cost: 7, ability: 7, positions: ['SF', 'SG'], attributes: ['Defender', 'Scorer'], boosts: [{requires: 'Passer', attribute: 'Shooter'}], boosters: [], description: "Gains Shooter attribute if playing with a Passer", chemistry: 4}),
    new PlayerCard({name: 'Paul George', cost: 7, ability: 7, positions: ['SF'], attributes: ['Defender', 'Shooter'], boosts: [], boosters: [], chemistry: 3}),
    new PlayerCard({name: 'Luka Doncic', cost: 6, ability: 6, positions: ['SF', 'PG'], attributes: ['Rookie', 'Scorer'], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'Andrew Wiggins', cost: 6, ability: 6, positions: ['SF'], attributes: ['Scorer'], boosts: [{requires: 'Shooter', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Shooter", chemistry: 4}),
    new PlayerCard({name: 'Jason Tatum', cost: 6, ability: 6, positions: ['SF', 'PF'], attributes: [], boosts: [{requires: 'Defender', attribute: 'Scorer'}], boosters: [], description: "Gains Scorer attribute if playing with a Defender", chemistry: 2}),
    new PlayerCard({name: 'Trevor Ariza', cost: 5, ability: 5, positions: ['SF'], attributes: ['Defender'], boosts: [], boosters: [], chemistry: 5}),
    new PlayerCard({name: 'Kris Middleton', cost: 5, ability: 5, positions: ['SF'], attributes: [], boosts: [{requires: 'Passer', attribute: 'Scorer'}], boosters: [], description: "Gains Scorer attribute if playing with a Passer", chemistry: 2}),
    new PlayerCard({name: 'Robert Covington', cost: 4, ability: 4, positions: ['SF', 'PF'], attributes: ['Defender', 'Shooter'], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'Brandom Ingram', cost: 4, ability: 4, positions: ['SF'], attributes: [], boosts: [], boosters: [], chemistry: 3}),    
    new PlayerCard({name: 'Kevin Knox', cost: 3, ability: 3, positions: ['SF'], attributes: ['Rookie'], boosts: [{requires: 'Veteran', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Veteran", chemistry: 4}),    
    new PlayerCard({name: 'Carmelo Anthony', cost: 3, ability: 3, positions: ['SF'], attributes: ['Veteran', 'Clutch'], boosts: [{requires: 'Passer', attribute: 'Shooter'}], boosters: [], description: "Gains Shooter attribute if playing with a Passer", chemistry: 5}),
    
    new PlayerCard({name: 'Kevin Durant', cost: 8, ability: 8, positions: ['PF', 'SF'], attributes: ['Shooter', 'Scorer'], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'G. Antetekoumpo', cost: 7, ability: 7, positions: ['PF', 'SF'], attributes: ['Defender', 'Passer', 'Rebounder'], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'Draymond Green', cost: 7, ability: 7, positions: ['PF', 'C'], attributes: ['Defender'], boosts: [{requires: 'Passer', attribute: 'Shooter'}], boosters: [], description: "Gains Shooter attribute if playing with a Passer", chemistry: 1}),
    new PlayerCard({name: 'Kristaps Porzingas', cost: 6, ability: 6, positions: ['PF', 'C'], attributes: ['Defender', 'Scorer'], boosts: [], boosters: [], chemistry: 3}),
    new PlayerCard({name: 'Blake Griffin', cost: 6, ability: 6, positions: ['PF'], attributes: ['Scorer'], boosts: [], boosters: [], chemistry: 4}),
    new PlayerCard({name: 'Aaron Gordon', cost: 5, ability: 5, positions: ['PF'], attributes: [], boosts: [], boosters: [], chemistry: 5}),
    new PlayerCard({name: 'Tobias Harris', cost: 5, ability: 5, positions: ['PF', 'SF'], attributes: [], boosts: [], boosters: [], chemistry: 1}),
    new PlayerCard({name: 'Kevin Love', cost: 5, ability: 5, positions: ['PF'], attributes: ['Shooter', 'Rebounder'], boosts: [{requires: 'Passer', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Passer", chemistry: 5}),
    new PlayerCard({name: 'Lauri Markenan', cost: 4, ability: 4, positions: ['PF'], attributes: ['Rookie', 'Shooter'], boosts: [], boosters: [], chemistry: 2}),    
    new PlayerCard({name: 'Julius Randle', cost: 4, ability: 4, positions: ['PF'], attributes: ['Rebounder'], boosts: [], boosters: [], chemistry: 3}),    
    new PlayerCard({name: 'Jordon Bell', cost: 3, ability: 3, positions: ['PF'], attributes: ['Rookie'], boosts: [{requires: 'Defender', attribute: 'Defender'}], boosters: [], description: "Gains Defender attribute if playing with a Defender", chemistry: 1}),    
    new PlayerCard({name: 'Dirk Nowitzki', cost: 3, ability: 3, positions: ['PF'], attributes: ['Veteran', 'Shooter', 'Rebounder'], boosts: [], boosters: [{attribute: 'Rookie', ability: 1}], description: "All Rookies get +1 ability", chemistry: 4}),
    
    new PlayerCard({name: 'Anthony Davis', cost: 8, ability: 8, positions: ['C', 'PF'], attributes: ['Defender', 'Scorer'], boosts: [], boosters: [], chemistry: 5}),    
    new PlayerCard({name: 'Joel Embiid', cost: 7, ability: 7, positions: ['C'], attributes: ['Defender', 'Scorer', 'Rebounder'], boosts: [{requires: 'Passer', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Passer", chemistry: 4}),
    new PlayerCard({name: 'DeMarcus Cousins', cost: 7, ability: 7, positions: ['C', 'PF'], attributes: ['Rebounder', 'Scorer'], boosts: [], boosters: [], chemistry: 5}),
    new PlayerCard({name: 'Nikola Jokic', cost: 6, ability: 6, positions: ['C'], attributes: ['Passer'], boosts: [], boosters: [], chemistry: 1}),
    new PlayerCard({name: 'Rudy Gobert', cost: 6, ability: 6, positions: ['C'], attributes: ['Defender'], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'Karl Anthony Towns', cost: 6, ability: 6, positions: ['C'], attributes: ['Scorer'], boosts: [], boosters: [], chemistry: 4}),    
    new PlayerCard({name: 'Clint Cappella', cost: 5, ability: 5, positions: ['C'], attributes: [], boosts: [{requires: 'Passer', ability: 1}], boosters: [], description: "Gains +1 ability if playing with a Passer", chemistry: 3}),    
    new PlayerCard({name: 'Al Horford', cost: 5, ability: 5, positions: ['C'], attributes: [], boosts: [], boosters: [], chemistry: 2}),
    new PlayerCard({name: 'DeAndre Jordan', cost: 4, ability: 4, positions: ['C'], attributes: ['Rebounder'], boosts: [], boosters: [], chemistry: 3}),    
    new PlayerCard({name: 'Andre Drummond', cost: 4, ability: 4, positions: ['C'], attributes: ['Rebounder'], boosts: [], boosters: [], chemistry: 4}),    
    new PlayerCard({name: 'DeAndre Ayton', cost: 3, ability: 3, positions: ['C'], attributes: ['Rookie', 'Rebounder'], boosts: [], boosters: [], chemistry: 1}),    
    new PlayerCard({name: 'Steven Adams', cost: 3, ability: 3, positions: ['C'], attributes: [], boosts: [], boosters: [], chemistry: 3}),
];

const freeAgentCards = duplicate(new PlayerCard({name: 'Free Agent', cost: 2, ability: 2, positions: null}), 30);

export const freeAgentDeck = new Deck({cards: freeAgentCards});

//const results = {};
//
//playerCards.forEach(player => {
//   const { chemistry, name } = player;
//   if(!results[chemistry]) results[chemistry] = [];
//   results[chemistry].push(name);
//});
//
//console.log(results);

const tradeCards = operationsCards
    .concat(strategyCards)
    .concat(playerCards);

export const tradeDeck = new Deck({cards: tradeCards});

tradeDeck.shuffle();

const starterCard = new OperationsCard({ name: 'Ticket Sales', cost: 1, income: 1});

const playerStarterCards = duplicate(starterCard, 8)

export const playerStarterDeck = new Deck({cards: playerStarterCards});

playerStarterDeck.shuffle();

const eventCards = duplicate(new NoEventCard(), 30)
    .concat([ 
        new InjuryEventCard({playerType: 'starters', playerIndex: 'pg', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'starters', playerIndex: 'sg', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'starters', playerIndex: 'sf', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'starters', playerIndex: 'pf', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'starters', playerIndex: 'c', length: getInjuryLength()}),    
        new InjuryEventCard({playerType: 'bench', playerIndex: 'g', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'bench', playerIndex: 'f', length: getInjuryLength()}),
        new InjuryEventCard({playerType: 'bench', playerIndex: 'c', length: getInjuryLength()}),
    ])
    .concat([
        new SuspensionEventCard({playerType: 'starters', playerIndex: 'pg'}),
        new SuspensionEventCard({playerType: 'starters', playerIndex: 'sg'}),
        new SuspensionEventCard({playerType: 'starters', playerIndex: 'sf'}),
        new SuspensionEventCard({playerType: 'starters', playerIndex: 'pf'}),
        new SuspensionEventCard({playerType: 'starters', playerIndex: 'c'}),
    ])
    .concat(duplicate(new EnergyEventCard({ name: 'Media Hype', description: '', energy: 2}), 5))
    .concat(duplicate(new EnergyEventCard({ name: 'Media Critisism', description: '', energy: -2}), 5))    
    .concat(duplicate(new MoneyEventCard({ name: 'Sell Out', description: '', money: 2}), 5))        
    .concat(duplicate(new MoneyEventCard({ name: 'Empty Seats', description: '', money: -2}), 5));

export const eventDeck = new Deck({ cards: eventCards });

eventDeck.shuffle();

function duplicate(item, n){
    const items = [];
    for(let i = 0; i < n; i++){
        items.push(clone(item));
    }
    return items;
}

function getInjuryLength(){
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    if(diceRoll < 4) return 1;
    if(diceRoll < 6) return 2;
    return 3;
}