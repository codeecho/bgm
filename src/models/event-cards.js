import EventCard from './EventCard';

export class InjuryEventCard extends EventCard{
    
    constructor({playerType, playerIndex}){
        super({name: 'Injury', type: 'Injury', description: 'Your ' + playerType + ' ' + playerIndex + ' has picked up an injury and is out for 1 week.'})
        this.playerType = playerType;
        this.playerIndex = playerIndex;
    }
    
}

export class SuspensionEventCard extends EventCard{
    
    constructor({playerType, playerIndex}){
        super({name: 'Suspension', type: 'Suspension', description: 'Your ' + playerType + ' ' + playerIndex + ' has been suspended for 1 week.'})
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