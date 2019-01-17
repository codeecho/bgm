import EventCard from './EventCard';

const playerTypeLabels = {
    starters: 'starting',
    bench: 'bench',
    reserves: 'reserve'
}

const playerIndexLabels = {
    'pg': 'Point Guard',
    'sg': 'Shooting Guard',
    'sf': 'Small Forward',
    'pf': 'Power Forward',
    'c': 'Center',
    'g': 'Guard',
    'f': 'Forward',
    'c': 'Center'
}

export class InjuryEventCard extends EventCard{
    
    constructor({playerType, playerIndex, length}){
        super({name: 'Injury', type: 'Injury', description: 'Your ' + playerTypeLabels[playerType] + ' ' + playerIndexLabels[playerIndex] + ' has picked up an injury and is out for ' + length + ' week.'})
        this.playerType = playerType;
        this.playerIndex = playerIndex;
        this.length = length;
    }
    
}

export class SuspensionEventCard extends EventCard{
    
    constructor({playerType, playerIndex}){
        super({name: 'Suspension', type: 'Suspension', description: 'Your ' + playerTypeLabels[playerType] + ' ' + playerIndexLabels[playerIndex] + ' has been suspended for 1 week.'})
        this.playerType = playerType;
        this.playerIndex = playerIndex;
    }
    
}

export class EnergyEventCard extends EventCard{
    
    constructor({name, description, energy}){
        super({name, type: 'Energy', description})
        this.energy = energy;
    }
    
}

export class MoneyEventCard extends EventCard{
    
    constructor({name, description, money}){
        super({name, type: 'Money', description})
        this.money = money;
    }
    
}

export class NoEventCard extends EventCard{
    
    constructor(){
        super({name: 'Business as Usual', type: 'NoEvent', description: 'Nothing of interest happened this week.'})
    }
    
}