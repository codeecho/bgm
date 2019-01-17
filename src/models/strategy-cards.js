import StrategyCard from './StrategyCard';

export class RecoverFromInjuryStrategyCard extends StrategyCard{
    
    constructor({cost}){
        super({name: 'Physio', cost, strategyType: 'RecoverFromInjury', description: '1 player can return from injury'});
    }
    
}

export class RescindSuspensionStrategyCard extends StrategyCard{
    
    constructor({cost}){
        super({name: 'Appeal', cost, strategyType: 'RescindSuspension', description: 'Rescind 1 players suspension'});
    }
    
}

export class EnergyStrategyCard extends StrategyCard{
    
    constructor({cost, name, description, energy}){
        super({name, cost, strategyType: 'Energy', description});
        this.energy = energy;
    }
    
}

export class PlayerTypeBonusStrategyCard extends StrategyCard{
    
    constructor({cost, name, description, attribute, bonus}){
        super({name, cost, strategyType: 'TypeBonus', description});
        this.attribute = attribute;
        this.bonus = bonus;
    }
    
}

export class SinglePlayerTypeBonusStrategyCard extends StrategyCard{
    
    constructor({cost, name, description, attribute, bonus}){
        super({name, cost, strategyType: 'SinglePlayerTypeBonus', description});
        this.attribute = attribute;
        this.bonus = bonus;
    }
    
}

export class BenchBonusStrategyCard extends StrategyCard{
    
    constructor({cost}){
        super({name: 'Bench Boost', cost, strategyType: 'BenchBonus', description: '1 bench player can use full ability'});
    }
    
}

export class StarterBonusStrategyCard extends StrategyCard{
    
    constructor({cost}){
        super({name: 'No Rest', cost, strategyType: 'StarterBonus', description: '1 starter plays the full game. Combine ability and bench ability. Remove 1 player from bench.'});
    }
    
}